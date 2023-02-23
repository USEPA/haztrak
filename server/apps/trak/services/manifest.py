import logging
from datetime import datetime, timedelta, timezone
from logging import Logger
from typing import Dict, List

from django.db import transaction

from apps.trak.models import Manifest
from apps.trak.serializers import ManifestSerializer

from .rcrainfo import RcrainfoService


class ManifestService:
    """
    ManifestServices encapsulates the uniform hazardous waste manifest subdomain
    business logic and exposes methods corresponding to use cases.
    """

    def __init__(self, *, username: str, rcrainfo: RcrainfoService = None, logger: Logger = None):
        self.username = username
        if rcrainfo is not None:
            self.rcrainfo = rcrainfo
        else:
            self.rcrainfo = RcrainfoService(api_username=self.username)
        if logger:
            self.logger = logger
        else:
            self.logger = logging.getLogger(__name__)

    def _retrieve_manifest(self, mtn: str):
        response = self.rcrainfo.get_manifest(mtn)
        if response.ok:
            return response.json()
        raise Exception(response.json())

    @transaction.atomic
    def _save_manifest(self, manifest_json: dict) -> Manifest:
        serializer = ManifestSerializer(data=manifest_json)
        if serializer.is_valid():
            return serializer.save()
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

        # map our keyword arguments to names expected by RCRAInfo
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

        response = self.rcrainfo.search_mtn(**filtered_params)
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
                self.logger.warning(exc)
                results["error"].append(mtn)
        return results
