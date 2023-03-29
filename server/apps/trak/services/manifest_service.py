import logging
from datetime import datetime, timedelta, timezone
from logging import Logger
from typing import Dict, List

from django.db import transaction
from django.db.models import Q
from requests import RequestException

from apps.trak.models import Manifest, QuickerSign
from apps.trak.serializers import ManifestSerializer

from ..models.handler_model import HandlerType
from ..serializers.signature_ser import QuickerSignSerializer
from ..tasks.manifest_task import pull_manifest
from .rcrainfo_service import RcrainfoService


class ManifestService:
    """
    ManifestServices encapsulates the uniform hazardous waste manifest subdomain
    business logic and exposes methods corresponding to use cases.
    """

    def __init__(self, *, username: str, rcrainfo: RcrainfoService = None):
        self.username = username
        self.rcrainfo = rcrainfo or RcrainfoService(api_username=self.username)
        self.logger = logging.getLogger(__name__)

    def __repr__(self):
        return (
            f"<{self.__class__.__name__}(username='{self.username}', rcrainfo='{self.rcrainfo}')>"
        )

    def _retrieve_manifest(self, mtn: str):
        response = self.rcrainfo.get_manifest(mtn)
        if response.ok:
            self.logger.debug(f"manifest pulled {mtn}")
            return response.json()
        else:
            self.logger.warning(f"error retrieving manifest {mtn}")
            raise RequestException(response.json())

    @transaction.atomic
    def _save_manifest(self, manifest_json: dict) -> Manifest:
        serializer = ManifestSerializer(data=manifest_json)
        if serializer.is_valid():
            self.logger.debug("manifest serializer is valid")
            manifest = serializer.save()
            self.logger.info(f"saved manifest {manifest.mtn}")
            return manifest
        else:
            self.logger.warning(f"malformed serializer data: {serializer.errors}")
            raise Exception(serializer.errors)

    def search_rcra_mtn(
        self,
        *,
        site_id: str = None,
        start_date: datetime = None,
        end_date: datetime = None,
        status: str = None,
        date_type: str = "UpdatedDate",
        state_code: str = None,
        site_type: str = None,
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
            end_date = end_date.replace(tzinfo=timezone.utc).strftime(date_format)
        else:
            end_date = datetime.utcnow().replace(tzinfo=timezone.utc).strftime(date_format)
        if start_date:
            start_date = start_date.replace(tzinfo=timezone.utc).strftime(date_format)
        else:
            # If no start date is specified, retrieve for ~last 3 years
            # (doesn't need be exact, hope it's not leap year)
            start_date = datetime.utcnow().replace(tzinfo=timezone.utc) - timedelta(
                minutes=60 * 24 * 30 * 12
            )
            start_date = start_date.strftime(date_format)

        # map our keyword arguments to fields expected by RCRAInfo
        search_params = {
            "stateCode": state_code,
            "siteId": site_id,
            "status": status,
            "dateType": date_type,
            "siteType": site_type,
            "endDate": end_date,
            "startDate": start_date,
        }
        # Remove arguments that are None
        filtered_params = {k: v for k, v in search_params.items() if v is not None}
        self.logger.debug(f"rcrainfo manifest search parameters {filtered_params}")

        response = self.rcrainfo.search_mtn(**filtered_params)
        self.logger.debug(f"rcrainfo manifest search response {response.json()}")

        if response.ok:
            return response.json()
        return []

    def pull_manifests(self, tracking_numbers: List[str]) -> Dict[str, List[str]]:
        """
        Pull a list of manifest from RCRAInfo

        Returns:
            results (Dict): with 2 members, 'success' and 'error' each is a list of MTN
            that corresponds to what manifest where successfully pulled or not.
        """
        results = {"success": [], "error": []}
        for mtn in tracking_numbers:
            try:
                manifest_json: dict = self._retrieve_manifest(mtn)
                manifest = self._save_manifest(manifest_json)
                results["success"].append(manifest.mtn)
            except Exception as exc:
                self.logger.warning(f"error pulling manifest {mtn}: {exc}")
                results["error"].append(mtn)
        return results

    def sign_manifest(self, signature: QuickerSign):
        results = {"success": [], "error": []}
        site_filter = self._get_handler_query(signature.site_id, signature.site_type)
        existing_mtn = Manifest.objects.filter(site_filter, mtn__in=signature.mtn)
        # get our list of valid MTN
        validated_mtn = [manifest.mtn for manifest in existing_mtn]
        # append any MTN, passed as an argument, not found in the DB to the error results
        print(signature.mtn)
        print(validated_mtn)
        unknown_mtn = list(set(signature.mtn).difference(set(validated_mtn)))
        self.logger.warning(f"MTN not found or site not listed as site type {unknown_mtn}")
        results["error"].extend(unknown_mtn)
        signature.mtn = validated_mtn
        signature_data = QuickerSignSerializer(signature)
        response = self.rcrainfo.sign_manifest(**signature_data.data)
        if response.ok:
            data = response.json()
            print(data)
            results["success"].append(validated_mtn)  # Temporary
            for manifest in response.json()["manifestReports"]:
                pull_manifest.delay(mtn=manifest["manifestTrackingNumber"], username=self.username)
        else:
            self.logger.warning(
                f"Error Quicker signing manifests, "
                f"response: {response.status_code} {response.json()}"
            )
            results["error"].append(validated_mtn)  # Temporary
        return results

    @classmethod
    def _get_handler_query(cls, site_id: str, site_type: HandlerType | str):
        """map handler type to django Query object"""
        if isinstance(site_type, str) and not isinstance(site_type, HandlerType):
            site_type = site_type.lower()
        match site_type:
            case HandlerType.GENERATOR | "generator":
                return Q(generator__handler__epa_id=site_id)
            case HandlerType.TRANSPORTER | "transporter":
                return Q(transporter__handler__epa_id=site_id)
            case HandlerType.TSDF | "tsdf":
                return Q(tsd__handler__epa_id=site_id)
            case _:
                raise ValueError(f"unrecognized site_type argument {site_type}")
