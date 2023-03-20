from typing import Dict, List

import pytest
import pytest_mock
from django.db.models import Q
from emanifest import RcrainfoResponse

from apps.trak.models.handler_model import HandlerType
from apps.trak.services import ManifestService, RcrainfoService


class TestManifestService:
    @pytest.fixture(autouse=True)
    def _setup(self, user_factory, site_factory, haztrak_json):
        self.user = user_factory()
        self.gen001 = site_factory()
        self.json_100031134elc = haztrak_json.MANIFEST.value
        self.tracking_number = self.json_100031134elc.get("manifestTrackingNumber", "123456789ELC")

    def test_pull_manifests(
        self, manifest_100033134elc_rcra_response, mocker: pytest_mock.MockerFixture
    ):
        """Test retrieves a manifest from RCRAInfo"""
        # we are creating a real RcrainfoService object, setting the auto_renew to false so
        # it does not attempt to call the RCRAInfo auth endpoint, and faking the response (fixture)
        # ToDo: replace real RcrainfoService with mock class.
        rcrainfo = RcrainfoService(api_username=self.user.username, auto_renew=False)
        manifest_service = ManifestService(username=self.user.username, rcrainfo=rcrainfo)
        results = manifest_service.pull_manifests(tracking_numbers=[self.tracking_number])
        assert self.tracking_number in results["success"]

    def test_search_rcra_mtn(self, search_site_mtn_rcra_response):
        """Test retrieves a manifest from RCRAInfo"""
        rcrainfo = RcrainfoService(api_username=self.user.username, auto_renew=False)
        manifest_service = ManifestService(username=self.user.username, rcrainfo=rcrainfo)
        results = manifest_service.search_rcra_mtn(site_id=self.gen001.epa_site.epa_id)
        assert isinstance(results, list)
        assert self.json_100031134elc.get("manifestTrackingNumber") in results


class TestSignManifest:
    mtn = ["123456789ELC", "987654321ELC"]

    @pytest.fixture(autouse=True)
    def _setup(
        self,
        user_factory,
        site_factory,
        manifest_factory,
        handler_factory,
        manifest_handler_factory,
    ):
        self.user = user_factory()
        self.generator = handler_factory()
        self.manifest_generator = manifest_handler_factory(handler=self.generator)
        self.site = site_factory(epa_site=self.generator)
        self.rcrainfo = RcrainfoService(api_username=self.user.username)
        self.manifests = [
            manifest_factory(mtn=mtn, generator=self.manifest_generator) for mtn in self.mtn
        ]

    @pytest.fixture(autouse=True)
    def _patch_pull_manifest(self, mocker, quicker_sign_response_factory):
        mocker.patch("apps.trak.tasks.manifest_task.pull_manifest.delay")
        mock_rcrainfo = mocker.Mock(spec=RcrainfoService)  # mock_rcrainfo class to be injected
        mock_rcrainfo.sign_manifest = mocker.MagicMock(
            return_value=mocker.Mock(
                spec=RcrainfoResponse,
                json=lambda: quicker_sign_response_factory(
                    mtn=self.mtn, site_id=self.site.epa_site.epa_id
                ),
            )
        )
        self.mock_rcrainfo = mock_rcrainfo

    def test_get_handler_query_maps_handler_types(self):
        manifest_service = ManifestService(username=self.user.username)
        query = manifest_service._get_handler_query(
            site_type=HandlerType.GENERATOR, site_id=self.site.epa_site.epa_id
        )
        assert isinstance(query, Q)

    def test_get_handler_query_maps_strings(self):
        manifest_service = ManifestService(username=self.user.username)
        query = manifest_service._get_handler_query(
            site_type="generator", site_id=self.site.epa_site.epa_id
        )
        assert isinstance(query, Q)

    def test_get_handler_query_raises_value_error(self):
        manifest_service = ManifestService(username=self.user.username)
        with pytest.raises(ValueError):
            manifest_service._get_handler_query(
                site_type="bad_argument", site_id=self.site.epa_site.epa_id
            )

    def test_removes_non_existent_mtn(self):
        """
        Test that manifest tracking numbers (MTN)
        not found in the Haztrak database are ignore
        """
        manifest_service = ManifestService(
            username=self.user.username, rcrainfo=self.mock_rcrainfo
        )
        bad_mtn = "000000000ELC"  # a manifest (tracking number) that does not exist
        mtn = self.mtn + [bad_mtn]
        results: Dict[str, List[str]] = manifest_service.sign_manifest(
            mtn=mtn,
            site_id=self.site.epa_site.epa_id,
            site_type=HandlerType.GENERATOR,
            printed_name="David Graham",
        )
        assert bad_mtn in results["error"]

    def test_calls_rcrainfo_service_sign_manifest(self):
        """Test that ManifestService calls the emanifest-py quicker sign method"""
        manifest_service = ManifestService(
            username=self.user.username, rcrainfo=self.mock_rcrainfo
        )
        manifest_service.sign_manifest(
            mtn=self.mtn,
            site_id=self.site.epa_site.epa_id,
            site_type=HandlerType.GENERATOR,
            printed_name="David Graham",
        )
        self.mock_rcrainfo.sign_manifest.assert_called()
