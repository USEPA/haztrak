import re

import pytest
from django.core.exceptions import ValidationError
from django.db.models import Q

from apps.sites.models import RcraSiteType
from apps.trak.models import WasteLine
from apps.trak.models.manifest_models import Manifest, draft_mtn, validate_mtn
from apps.trak.serializers import HandlerSerializer, WasteLineSerializer


@pytest.mark.django_db
class TestManifestModel:
    def test_draft_mtn_format(self):
        """
        ensure our default MTN for draft manifests follows the
        same format as EPA uniform hazardous waste (e.g., 123456789ELC)
        """
        new_mtn = draft_mtn()
        assert re.match(r"[0-9]{9}[a-zA-Z]{3}", new_mtn)

    @pytest.mark.parametrize("mtn", ["123456789ELC", "111111111DFT", "100200300JJK"])
    def test_mtn_validation_raises_no_error(self, mtn):
        # Act/Assert
        assert validate_mtn(mtn) is None

    @pytest.mark.parametrize("mtn", ["foo_bar", "111111DFT", "123456789"])
    def test_mtn_validation_raises_error(self, mtn):
        # Act/Assert
        with pytest.raises(ValidationError):
            assert validate_mtn(mtn) is None

    def test_get_handler_query_maps_handler_types(self):
        query = Manifest.objects.get_handler_query(
            site_type=RcraSiteType.GENERATOR, site_id="mock_EPA_ID"
        )
        assert isinstance(query, Q)

    def test_get_handler_query_maps_strings(self):
        query = Manifest.objects.get_handler_query(site_type="generator", site_id="mock_EPA_ID")
        assert isinstance(query, Q)

    def test_get_handler_query_raises_value_error(self):
        with pytest.raises(ValueError):
            Manifest.objects.get_handler_query(site_type="bad_argument", site_id="mock_EPA_ID")


class TestManifestManagerSaveMethod:
    def test_updates_the_manifest_tracking_number(self, manifest_factory):
        old_mtn = "000000123DFT"
        new_mtn = "000000123DFT"
        old_manifest = manifest_factory(mtn=old_mtn)
        new_manifest = Manifest.objects.save(old_manifest, **{"mtn": new_mtn})
        assert new_manifest.mtn == new_mtn

    def test_updates_generator(
        self, manifest_factory, manifest_handler_factory, rcra_site_factory, validated_data_factory
    ):
        mtn = "000000123DFT"
        generator_epa_id = "TXD987654321"
        old_manifest = manifest_factory(mtn=mtn)
        txd987654321 = rcra_site_factory(epa_id=generator_epa_id)
        manifest_generator = manifest_handler_factory(rcra_site=txd987654321)
        generator_validated_data = validated_data_factory(
            instance=manifest_generator, serializer=HandlerSerializer
        )
        new_manifest = Manifest.objects.save(
            old_manifest, **{"generator": generator_validated_data}
        )
        assert new_manifest.generator.rcra_site.epa_id == generator_epa_id

    def test_updates_waste_lines_by_line_number(
        self,
        manifest_factory,
        manifest_handler_factory,
        rcra_site_factory,
        waste_line_factory,
        validated_data_factory,
    ):
        mtn = "000000123DFT"
        original_manifest = manifest_factory(mtn=mtn)
        original_waste_line = waste_line_factory(
            manifest=original_manifest, line_number=1, epa_waste=False
        )
        waste_data = validated_data_factory(
            instance=original_waste_line, serializer=WasteLineSerializer
        )
        waste_data["epa_waste"] = True
        Manifest.objects.save(
            original_manifest,
            **{"wastes": [waste_data]},
        )
        new_waste_lines = WasteLine.objects.filter(manifest__mtn=mtn)
        for wl in new_waste_lines:
            print(wl)
        assert new_waste_lines.count() == 1
        assert new_waste_lines.first().epa_waste is True

    def test_updates_tsdf(
        self, manifest_factory, manifest_handler_factory, rcra_site_factory, validated_data_factory
    ):
        mtn = "000000123DFT"
        tsdf_epa_id = "TXD987654321"
        original_manifest = manifest_factory(mtn=mtn)
        txd987654321 = rcra_site_factory(epa_id=tsdf_epa_id, site_type="Tsdf")
        manifest_tsdf = manifest_handler_factory(rcra_site=txd987654321)
        validated_data = validated_data_factory(
            instance=manifest_tsdf, serializer=HandlerSerializer
        )
        new_manifest = Manifest.objects.save(original_manifest, **{"tsdf": validated_data})
        assert new_manifest.tsdf.rcra_site.epa_id == tsdf_epa_id
