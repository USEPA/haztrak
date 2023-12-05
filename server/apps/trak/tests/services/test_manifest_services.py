import pytest
import pytest_mock
from django.forms import model_to_dict
from rest_framework import status

from apps.core.services import RcrainfoService, get_rcrainfo_client
from apps.trak.models import Handler, WasteLine
from apps.trak.serializers import HandlerSerializer, WasteLineSerializer
from apps.trak.services import ManifestService, update_manifest


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


class TestUpdateManifest:
    @pytest.fixture
    def validated_data_factory(self):
        def _create_data_dict(*, instance, serializer):
            data = serializer(instance).data
            new_serializer = serializer(data=data)
            new_serializer.is_valid(raise_exception=True)
            return new_serializer.validated_data

        return _create_data_dict

    def test_updates_the_manifest_tracking_number(self, manifest_factory):
        old_mtn = "000000123DFT"
        new_mtn = "000000123DFT"
        manifest_factory(mtn=old_mtn)
        new_manifest = update_manifest(mtn=old_mtn, data={"mtn": new_mtn})
        assert new_manifest.mtn == new_mtn

    def test_updates_generator(
        self, manifest_factory, manifest_handler_factory, rcra_site_factory, validated_data_factory
    ):
        mtn = "000000123DFT"
        generator_epa_id = "TXD987654321"
        manifest_factory(mtn=mtn)
        txd987654321 = rcra_site_factory(epa_id=generator_epa_id)
        manifest_generator = manifest_handler_factory(rcra_site=txd987654321)
        generator_validated_data = validated_data_factory(
            instance=manifest_generator, serializer=HandlerSerializer
        )
        new_manifest = update_manifest(mtn=mtn, data={"generator": generator_validated_data})
        assert new_manifest.generator.rcra_site.epa_id == generator_epa_id

    def test_removes_old_waste_lines(
        self,
        manifest_factory,
        manifest_handler_factory,
        rcra_site_factory,
        waste_line_factory,
        validated_data_factory,
    ):
        mtn = "000000123DFT"
        original_manifest = manifest_factory(mtn=mtn)
        waste_line_factory(manifest=original_manifest, line_number=1)
        new_waste_line = waste_line_factory(manifest=original_manifest, line_number=1)
        new_waste_validated_data = validated_data_factory(
            instance=new_waste_line, serializer=WasteLineSerializer
        )
        update_manifest(
            mtn=mtn,
            data={"wastes": [new_waste_validated_data]},
        )
        new_waste_lines = WasteLine.objects.filter(manifest__mtn=mtn)
        for wl in new_waste_lines:
            print(wl)

    def test_updates_tsdf(
        self, manifest_factory, manifest_handler_factory, rcra_site_factory, validated_data_factory
    ):
        mtn = "000000123DFT"
        tsdf_epa_id = "TXD987654321"
        manifest_factory(mtn=mtn)
        txd987654321 = rcra_site_factory(epa_id=tsdf_epa_id)
        manifest_tsdf = manifest_handler_factory(rcra_site=txd987654321)
        validated_data = validated_data_factory(
            instance=manifest_tsdf, serializer=HandlerSerializer
        )
        print(validated_data)


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
