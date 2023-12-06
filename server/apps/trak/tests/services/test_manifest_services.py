import pytest
import pytest_mock
from rest_framework import status

from apps.core.services import RcrainfoService, get_rcrainfo_client
from apps.trak.models import Manifest
from apps.trak.services import ManifestService
from apps.trak.services.manifest_services import get_manifests


class TestManifestService:
    @pytest.fixture(autouse=True)
    def _setup(self, user_factory, haztrak_site_factory, haztrak_json):
        self.user = user_factory()
        self.gen001 = haztrak_site_factory()
        self.json_100031134elc = haztrak_json.MANIFEST.value
        self.tracking_number = self.json_100031134elc.get("manifestTrackingNumber", "123456789ELC")

    @pytest.fixture
    def manifest_100033134elc_rcra_response(self, haztrak_json, mock_responses):
        rcrainfo = get_rcrainfo_client(api_id="my_mock_id", api_key="my_mock_key")
        manifest_json = haztrak_json.MANIFEST.value
        mock_responses.get(
            url=f'{rcrainfo.base_url}v1/emanifest/manifest/{manifest_json.get("manifestTrackingNumber")}',
            content_type="application/json",
            json=manifest_json,
            status=status.HTTP_200_OK,
        )

    def test_pull_manifests(
        self, manifest_100033134elc_rcra_response, mocker: pytest_mock.MockerFixture
    ):
        """Test retrieves a manifest from RCRAInfo"""
        rcrainfo = RcrainfoService(auto_renew=False)
        manifest_service = ManifestService(username=self.user.username, rcrainfo=rcrainfo)
        results = manifest_service.pull_manifests(tracking_numbers=[self.tracking_number])
        assert self.tracking_number in results["success"]


class TestSignManifest:
    def test_filter_mtn_removed_mtn_not_associated_with_site(
        self,
        manifest_factory,
        rcra_site_factory,
        manifest_handler_factory,
        haztrak_profile_factory,
    ):
        # Arrange
        profile = haztrak_profile_factory()
        my_site = rcra_site_factory()
        my_handler = manifest_handler_factory(rcra_site=my_site)
        my_manifest = manifest_factory(generator=my_handler)
        not_my_manifest = manifest_factory(mtn="123456555ELC")

        manifest_service = ManifestService(username=profile.user.username)
        # Act
        filtered_manifest = manifest_service._filter_mtn(
            mtn=[my_manifest.mtn, not_my_manifest.mtn],
            site_id=my_handler.rcra_site.epa_id,
            site_type=my_handler.rcra_site.site_type,
        )
        # Assert
        assert my_manifest.mtn in filtered_manifest
        assert not_my_manifest.mtn not in filtered_manifest


class TestGetManifestService:
    def test_returns_manifests_from_all_user_sites_by_default(
        self,
        manifest_factory,
        haztrak_profile_factory,
        user_factory,
        haztrak_site_factory,
        rcra_site_factory,
        haztrak_site_permission_factory,
        manifest_handler_factory,
        manifest_transporter_factory,
    ):
        # Arrange
        profile = haztrak_profile_factory()
        # Generator site
        vatestgen001 = rcra_site_factory(epa_id="VATESTGEN001")
        generator = manifest_handler_factory(rcra_site=vatestgen001)
        my_site = haztrak_site_factory(rcra_site=vatestgen001, name="My Site")
        haztrak_site_permission_factory(profile=profile, site=my_site)
        manifest_factory(generator=generator)

        # Transporter site
        vatesttran001 = rcra_site_factory(epa_id="VATESTTRAN001")
        my_transporter_site = haztrak_site_factory(rcra_site=vatesttran001, name="My Transporter")
        haztrak_site_permission_factory(profile=profile, site=my_transporter_site)
        transporter_manifest = manifest_factory()
        manifest_transporter_factory(rcra_site=vatesttran001, manifest=transporter_manifest)

        # TSDF site
        vatesttsdf001 = rcra_site_factory(epa_id="VATESTTSDF001")
        my_tsdf = haztrak_site_factory(rcra_site=vatesttsdf001, name="My TSDF")
        haztrak_site_permission_factory(profile=profile, site=my_tsdf)
        tsdf = manifest_handler_factory(rcra_site=vatesttsdf001)
        manifest_factory(tsdf=tsdf)
        # Act
        manifests = get_manifests(username=profile.user.username)
        # Assert
        assert manifests.count() == Manifest.objects.count()

    def test_filters_by_epa_id(
        self,
        manifest_factory,
        haztrak_profile_factory,
        user_factory,
        haztrak_site_factory,
        rcra_site_factory,
        haztrak_site_permission_factory,
        manifest_handler_factory,
        manifest_transporter_factory,
    ):
        # Arrange
        profile = haztrak_profile_factory()
        # Generator site
        vatestgen001 = rcra_site_factory(epa_id="VATESTGEN001")
        generator = manifest_handler_factory(rcra_site=vatestgen001)
        my_site = haztrak_site_factory(rcra_site=vatestgen001, name="My Site")
        haztrak_site_permission_factory(profile=profile, site=my_site)
        generator_manifest = manifest_factory(generator=generator)

        # TSDF site
        vatesttsdf001 = rcra_site_factory(epa_id="VATESTTSDF001")
        my_tsdf = haztrak_site_factory(rcra_site=vatesttsdf001, name="My TSDF")
        haztrak_site_permission_factory(profile=profile, site=my_tsdf)
        tsdf = manifest_handler_factory(rcra_site=vatesttsdf001)
        tsdf_manifest = manifest_factory(tsdf=tsdf)
        # Act
        manifests = get_manifests(username=profile.user.username, epa_id=vatestgen001.epa_id)
        # Assert
        returned_mtn = [i.mtn for i in manifests]
        assert generator_manifest.mtn in returned_mtn
        assert tsdf_manifest.mtn not in returned_mtn

    def test_filters_by_site_type(
        self,
        manifest_factory,
        haztrak_profile_factory,
        user_factory,
        haztrak_site_factory,
        rcra_site_factory,
        haztrak_site_permission_factory,
        manifest_handler_factory,
        manifest_transporter_factory,
    ):
        # Arrange
        profile = haztrak_profile_factory()
        # my site operates as a TSDF and generator
        vatesttsdf001 = rcra_site_factory(epa_id="VATESTTSDF001")
        my_site = haztrak_site_factory(rcra_site=vatesttsdf001, name="My TSDF")
        haztrak_site_permission_factory(profile=profile, site=my_site)
        my_site_as_tsdf = manifest_handler_factory(rcra_site=vatesttsdf001)
        tsdf_manifest = manifest_factory(tsdf=my_site_as_tsdf)
        my_site_as_generator = manifest_handler_factory(rcra_site=vatesttsdf001)
        gen_manifest = manifest_factory(generator=my_site_as_generator)
        # Act
        all_site_manifests = get_manifests(
            username=profile.user.username,
            epa_id=vatesttsdf001.epa_id,
        )
        all_gen_manifests = get_manifests(
            username=profile.user.username, epa_id=vatesttsdf001.epa_id, site_type="Generator"
        )
        # Assert
        returned_gen_mtn = [i.mtn for i in all_gen_manifests]
        returned_all_mtn = [i.mtn for i in all_site_manifests]
        assert gen_manifest.mtn in returned_gen_mtn
        assert tsdf_manifest.mtn not in returned_gen_mtn
        assert tsdf_manifest.mtn in returned_all_mtn
