import logging
from datetime import datetime, timedelta, timezone
from typing import List, Literal, Optional, TypedDict

from django.db import transaction
from django.db.models import QuerySet
from emanifest import RcrainfoResponse  # type: ignore
from requests import RequestException  # type: ignore
from rest_framework.exceptions import ValidationError

from apps.core.services import RcrainfoService  # type: ignore
from apps.trak.models import Manifest, QuickerSign  # type: ignore
from apps.trak.serializers import ManifestSerializer, QuickerSignSerializer  # type: ignore
from apps.trak.tasks import pull_manifest, save_rcrainfo_manifest, sign_manifest  # type: ignore

logger = logging.getLogger(__name__)


class TaskResponse(TypedDict):
    """Type definition for the response returned from starting a task"""

    taskId: str


class ManifestServiceError(Exception):
    """Base class for ManifestService exceptions"""

    def __init__(self, message: str = None, *args):
        self.message = message
        super().__init__(*args)


class PullManifestsResult(TypedDict):
    """Type definition for the results returned from pulling manifests from RCRAInfo"""

    success: List[str]
    error: List[str]


class ManifestService:
    """
    ManifestServices encapsulates the uniform hazardous waste manifest subdomain
    business logic and exposes methods corresponding to use cases.
    """

    def __init__(self, *, username: str, rcrainfo: Optional[RcrainfoService] = None):
        self.username = username
        self.rcrainfo = rcrainfo or RcrainfoService(api_username=self.username)

    def __repr__(self):
        return (
            f"<{self.__class__.__name__}(username='{self.username}', rcrainfo='{self.rcrainfo}')>"
        )

    def search_rcra_mtn(
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
        """
        Search RCRAInfo for manifests, an abstraction of RcrainfoService's search_mtn

        Keyword Args:
            site_id (str): EPA ID a site.
            start_date (datetime): start of search window, defaults to 3 years ago.
            end_date (datetime): end of search window, defaults to now.
            status (str): manifest status in RCRAInfo.
            date_type (str): "CertifiedDate|ReceivedDate|ShippedDate|UpdatedDate"
            state_code (str): Two-letter code representing a state (e.g., "TX", "CA")
            site_type (str): "Generator|Tsdf|Transporter|RejectionInfo_AlternateTsdf"
        """
        date_format = "%Y-%m-%dT%H:%M:%SZ"
        if end_date:
            end_date_str = end_date.replace(tzinfo=timezone.utc).strftime(date_format)
        else:
            end_date_str = datetime.utcnow().replace(tzinfo=timezone.utc).strftime(date_format)
        if start_date:
            start_date_str = start_date.replace(tzinfo=timezone.utc).strftime(date_format)
        else:
            # If no start date is specified, retrieve for last ~3 years
            start_date = datetime.utcnow().replace(tzinfo=timezone.utc) - timedelta(
                minutes=60  # 60 seconds/1minutes
                * 24  # 24 hours/1day
                * 30  # 30 days/1month
                * 36  # 36 months/3years = 3/years
            )
            start_date_str = start_date.strftime(date_format)

        response = self.rcrainfo.search_mtn(
            site_id=site_id,  # type: ignore
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

    def pull_manifests(self, tracking_numbers: List[str]) -> PullManifestsResult:
        """
        Pull a list of manifest from RCRAInfo

        Returns:
            results (Dict): with 2 members, 'success' and 'error' each is a list of MTN
            that corresponds to what manifest where successfully pulled or not.
        """
        results: PullManifestsResult = {"success": [], "error": []}
        logger.info(f"pulling manifests {tracking_numbers}")
        for mtn in tracking_numbers:
            try:
                manifest_json: dict = self._retrieve_manifest(mtn)
                manifest = self._save_manifest_to_db(manifest_json)
                results["success"].append(manifest.mtn)
            except Exception as exc:
                logger.warning(f"error pulling manifest {mtn}: {exc}")
                results["error"].append(mtn)
        logger.info(f"pull manifests results: {results}")
        return results

    def sign_manifests(self, *, signature_data: dict) -> TaskResponse:
        """
        Electronically sign manifests in RCRAInfo through the RESTful API. Returns the results by
        manifest tracking number (MTN) in a Dict.
        """
        signature_data["mtn"] = self._filter_mtn(
            mtn=signature_data["mtn"],
            site_id=signature_data["site_id"],
            site_type=signature_data["site_type"],
        )
        task = sign_manifest.delay(username=self.username, **signature_data)
        return {"taskId": task.id}

    def quicker_sign_manifests(self, **signature_data: dict) -> PullManifestsResult:
        results: PullManifestsResult = {"success": [], "error": []}
        serializer = QuickerSignSerializer(signature_data)
        response = self.rcrainfo.sign_manifest(**serializer.data)
        if response.ok:
            for manifest in response.json()["manifestReports"]:
                pull_manifest.delay(
                    mtn=[manifest["manifestTrackingNumber"]], username=self.username
                )
        else:
            logger.warning(f"Error Quicker signing {response.status_code} {response.json()}")
        return results

    def create_manifest(self, *, manifest: dict) -> dict | TaskResponse:
        """
        Create a manifest in RCRAInfo through the RESTful API.
        :param manifest: Dict
        :return:
        """
        if self.rcrainfo.has_api_user and manifest.get("status") != "NotAssigned":
            logger.info("POSTing manifest to RCRAInfo.")
            task = save_rcrainfo_manifest.delay(manifest_data=manifest, username=self.username)
            return {"taskId": task.id}
        else:
            logger.info("Saving manifest manifest to DB without RCRAInfo")
            saved_manifest = self._save_manifest_to_db(manifest)
            return ManifestSerializer(saved_manifest).data

    def save_to_rcrainfo(self, manifest: dict) -> dict:
        logger.info(f"start save manifest to rcrainfo with arguments {manifest}")
        create_resp: RcrainfoResponse = self.rcrainfo.save_manifest(manifest)
        try:
            if create_resp.ok:
                logger.info(
                    f"successfully created manifest "
                    f"{create_resp.json()['manifestTrackingNumber']} in RCRAInfo"
                )
                self.pull_manifests([create_resp.json()["manifestTrackingNumber"]])
                return create_resp.json()
            raise ManifestServiceError(message=f"error creating manifest: {create_resp.json()}")
        except KeyError:
            logger.error(
                f"error retrieving manifestTrackingNumber from response: {create_resp.json()}"
            )
            raise ValueError("malformed payload")

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
    def _save_manifest_to_db(self, manifest_json: dict) -> Manifest:
        """Save manifest to Haztrak database"""
        logger.info("saving manifest to DB")
        manifest_query: QuerySet = Manifest.objects.filter(
            mtn=manifest_json["manifestTrackingNumber"]
        )
        if manifest_query.exists():
            serializer = ManifestSerializer(manifest_query.get(), data=manifest_json)
        else:
            serializer = ManifestSerializer(data=manifest_json)
        if serializer.is_valid():
            logger.debug("manifest serializer is valid")
            manifest = serializer.save()
            logger.info(f"saved manifest {manifest.mtn}")
            return manifest
        else:
            logger.warning(f"malformed serializer data: {serializer.errors}")
            raise ValidationError(serializer.errors)
