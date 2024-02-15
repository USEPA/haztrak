import logging
from datetime import UTC, datetime, timedelta, timezone
from typing import List, Literal, NotRequired, Optional, TypedDict

from django.db import transaction
from django.db.models import QuerySet
from emanifest import RcrainfoResponse
from requests import RequestException

from apps.core.services import RcrainfoService, get_rcrainfo_client
from apps.handler.models import QuickerSign
from apps.handler.serializers import QuickerSignSerializer
from apps.manifest.models import Manifest
from apps.manifest.serializers import ManifestSerializer
from apps.manifest.tasks import pull_manifest, sign_manifest

logger = logging.getLogger(__name__)


class QuickerSignData(TypedDict):
    """Type definition for the data required to sign a manifest"""

    mtn: list[str]
    site_id: str
    site_type: Literal["Generator", "Tsdf", "Transporter"]
    printed_name: str
    printed_data: datetime
    transporter_order: NotRequired[int]


class TaskResponse(TypedDict):
    """Type definition for the response returned from starting a task"""

    taskId: str


class EManifestError(Exception):
    """Base class for EManifest exceptions"""

    def __init__(self, message: str = None, *args):
        self.message = message
        super().__init__(*args)


class PullManifestsResult(TypedDict):
    """Type definition for the results returned from pulling manifests from RCRAInfo"""

    success: List[str]
    error: List[str]


class EManifest:
    """IO interface with the e-Manifest system."""

    def __init__(self, *, username: str, rcrainfo: Optional[RcrainfoService] = None):
        self.username = username
        self.rcrainfo = rcrainfo or get_rcrainfo_client(username=username)

    @property
    def is_available(self) -> bool:
        """Check if e-Manifest is available"""
        return self.rcrainfo.has_rcrainfo_credentials

    def search(
        self,
        *,
        site_id: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        status: Optional[str] = None,
        date_type: str = "UpdatedDate",
        state_code: Optional[str] = None,
        site_type: Optional[str] = None,
    ) -> List[str]:
        """Search for manifests from e-Manifest, an abstraction of RcrainfoService's search_mtn"""
        date_format = "%Y-%m-%dT%H:%M:%SZ"
        if end_date:
            end_date_str = end_date.replace(tzinfo=timezone.utc).strftime(date_format)
        else:
            end_date_str = datetime.now(UTC).strftime(date_format)
        if start_date:
            start_date_str = start_date.replace(tzinfo=timezone.utc).strftime(date_format)
        else:
            # If no start date is specified, retrieve for last ~3 years
            start_date = datetime.now(UTC) - timedelta(
                minutes=60  # 60 seconds/1minutes
                * 24  # 24 hours/1day
                * 30  # 30 days/1month
                * 36  # 36 months/3years = 3/years
            )
            start_date_str = start_date.strftime(date_format)

        response = self.rcrainfo.search_mtn(
            site_id=site_id,
            site_type=site_type,
            state_code=state_code,
            start_date=start_date_str,
            end_date=end_date_str,
            status=status,
            date_type=date_type,
        )

        if response.ok:
            return response.json()
        return []

    def pull(self, tracking_numbers: List[str]) -> PullManifestsResult:
        """Retrieve manifests from e-Manifest and save to database"""
        results: PullManifestsResult = {"success": [], "error": []}
        logger.info(f"pulling manifests {tracking_numbers}")
        for mtn in tracking_numbers:
            try:
                manifest_json: dict = self._retrieve_manifest(mtn)
                manifest = self._save_manifest_json_to_db(manifest_json)
                results["success"].append(manifest.mtn)
            except Exception as exc:
                logger.warning(f"error pulling manifest {mtn}: {exc}")
                results["error"].append(mtn)
        logger.info(f"pull manifests results: {results}")
        return results

    def sign(self, *, signature: QuickerSign) -> TaskResponse:
        """validate and Launch an asynchronous task to electronically sign a manifest."""
        signature.mtn = self._filter_mtn(
            mtn=signature.mtn, site_id=signature.site_id, site_type=signature.site_type
        )
        signature_serializer = QuickerSignSerializer(signature)
        task = sign_manifest.delay(username=self.username, **signature_serializer.data)
        return {"taskId": task.id}

    def submit_quick_signature(self, signature: dict) -> PullManifestsResult:
        results: PullManifestsResult = {"success": [], "error": []}
        response = self.rcrainfo.sign_manifest(**signature)
        if response.ok:
            for manifest in response.json()["manifestReports"]:
                pull_manifest.delay(
                    mtn=[manifest["manifestTrackingNumber"]], username=self.username
                )
        else:
            logger.warning(f"Error Quicker signing {response.status_code} {response.json()}")
        return results

    def save(self, manifest: dict) -> dict:
        """Save manifest to e-Manifest"""
        logger.info(f"start save manifest to rcrainfo with arguments {manifest}")
        create_resp: RcrainfoResponse = self.rcrainfo.save_manifest(manifest)
        try:
            if create_resp.ok:
                logger.info(
                    f"successfully created manifest "
                    f"{create_resp.json()['manifestTrackingNumber']} in RCRAInfo"
                )
                self.pull([create_resp.json()["manifestTrackingNumber"]])
                return create_resp.json()
            raise EManifestError(message=f"error creating manifest: {create_resp.json()}")
        except KeyError:
            logger.error(
                f"error retrieving manifestTrackingNumber from response: {create_resp.json()}"
            )
            raise EManifestError("malformed payload")

    @staticmethod
    def _filter_mtn(
        *, mtn: list[str], site_id: str, site_type: Literal["Generator", "Tsdf", "Transporter"]
    ) -> list[str]:
        site_filter = Manifest.objects.get_handler_query(site_id, site_type)
        existing_mtn = Manifest.objects.existing_mtn(site_filter, mtn=mtn)
        return [manifest.mtn for manifest in existing_mtn]

    def _retrieve_manifest(self, mtn: str):
        """Retrieve a manifest from RCRAInfo"""
        logger.info(f"retrieving manifest from RCRAInfo {mtn}")
        response = self.rcrainfo.get_manifest(mtn)
        if response.ok:
            logger.debug(f"manifest pulled {mtn}")
            return response.json()
        else:
            logger.warning(f"error retrieving manifest {mtn}")
            raise RequestException(response.json())

    @transaction.atomic
    def _save_manifest_json_to_db(self, manifest_json: dict) -> Manifest:
        """Save manifest to Haztrak database"""
        logger.info("saving manifest to DB")
        manifest_query: QuerySet = Manifest.objects.filter(
            mtn=manifest_json["manifestTrackingNumber"]
        )
        if manifest_query.exists():
            serializer = ManifestSerializer(manifest_query.get(), data=manifest_json)
        else:
            serializer = ManifestSerializer(data=manifest_json)
        serializer.is_valid(raise_exception=True)
        logger.debug("manifest serializer is valid")
        manifest = serializer.save()
        logger.info(f"saved manifest {manifest.mtn}")
        return manifest
