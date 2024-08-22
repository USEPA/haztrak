from manifest.models import Manifest
from manifest.serializers import ManifestSerializer
from manifest.services import create_manifest, get_manifests


class TestGetManifestService:
    # ToDo: fix transaction related to this test
    def test_returns_manifests_from_all_user_sites_by_default(
        self,
        manifest_factory,
        profile_factory,
        user_factory,
        site_factory,
        rcra_site_factory,
        perm_factory,
        manifest_handler_factory,
        manifest_transporter_factory,
    ):
        user = user_factory()
        # Arrange
        vatestgen001 = rcra_site_factory(epa_id="VATESTGEN001")
        generator = manifest_handler_factory(rcra_site=vatestgen001)
        my_site = site_factory(rcra_site=vatestgen001, name="My Site")
        perm_factory(user, ["org.view_site"], my_site)
        manifest_factory(generator=generator)

        # Transporter site
        vatesttran001 = rcra_site_factory(epa_id="VATESTTRAN001")
        my_transporter_site = site_factory(rcra_site=vatesttran001, name="My Transporter")
        perm_factory(user, ["org.view_site"], my_transporter_site)
        transporter_manifest = manifest_factory()
        manifest_transporter_factory(rcra_site=vatesttran001, manifest=transporter_manifest)

        # TSDF site
        vatesttsdf001 = rcra_site_factory(epa_id="VATESTTSDF001")
        my_tsdf = site_factory(rcra_site=vatesttsdf001, name="My TSDF")
        perm_factory(user, ["org.view_site"], my_tsdf)
        tsdf = manifest_handler_factory(rcra_site=vatesttsdf001)
        manifest_factory(tsdf=tsdf)
        # Act
        manifests = get_manifests(username=user.username)
        # Assert
        assert manifests.count() == Manifest.objects.count()

    def test_filters_by_epa_id(
        self,
        manifest_factory,
        user_factory,
        site_factory,
        rcra_site_factory,
        perm_factory,
        manifest_handler_factory,
        manifest_transporter_factory,
    ):
        # Arrange
        user = user_factory()
        # Generator site
        vatestgen001 = rcra_site_factory(epa_id="VATESTGEN001")
        generator = manifest_handler_factory(rcra_site=vatestgen001)
        my_site = site_factory(rcra_site=vatestgen001, name="My Site")
        perm_factory(user, ["org.view_site"], my_site)
        generator_manifest = manifest_factory(generator=generator)

        # TSDF site
        vatesttsdf001 = rcra_site_factory(epa_id="VATESTTSDF001")
        my_tsdf = site_factory(rcra_site=vatesttsdf001, name="My TSDF")
        perm_factory(user, ["org.view_site"], my_tsdf)
        tsdf = manifest_handler_factory(rcra_site=vatesttsdf001)
        tsdf_manifest = manifest_factory(tsdf=tsdf)
        # Act
        manifests = get_manifests(username=user.username, epa_id=vatestgen001.epa_id)
        # Assert
        returned_mtn = [i.mtn for i in manifests]
        assert generator_manifest.mtn in returned_mtn
        assert tsdf_manifest.mtn not in returned_mtn

    def test_filters_by_site_type(
        self,
        manifest_factory,
        user_factory,
        site_factory,
        perm_factory,
        rcra_site_factory,
        manifest_handler_factory,
        manifest_transporter_factory,
    ):
        # Arrange
        user = user_factory()
        # my site operates as a TSDF and generator
        vatesttsdf001 = rcra_site_factory(epa_id="VATESTTSDF001")
        my_site = site_factory(rcra_site=vatesttsdf001, name="My TSDF")
        perm_factory(user, ["org.view_site"], my_site)
        my_site_as_tsdf = manifest_handler_factory(rcra_site=vatesttsdf001)
        tsdf_manifest = manifest_factory(tsdf=my_site_as_tsdf)
        my_site_as_generator = manifest_handler_factory(rcra_site=vatesttsdf001)
        gen_manifest = manifest_factory(generator=my_site_as_generator)
        # Act
        all_site_manifests = get_manifests(
            username=user.username,
            epa_id=vatesttsdf001.epa_id,
        )
        all_gen_manifests = get_manifests(
            username=user.username, epa_id=vatesttsdf001.epa_id, site_type="Generator"
        )
        # Assert
        returned_gen_mtn = [i.mtn for i in all_gen_manifests]
        returned_all_mtn = [i.mtn for i in all_site_manifests]
        assert gen_manifest.mtn in returned_gen_mtn
        assert tsdf_manifest.mtn not in returned_gen_mtn
        assert tsdf_manifest.mtn in returned_all_mtn


class TestCreateManifest:
    def test_create_manifest_saves_drafts_to_db(
        self,
        manifest_factory,
        validated_data_factory,
        user_factory,
        user_with_org_factory,
    ):
        # Arrange
        new_mtn = "987654321ELC"
        user, org = user_with_org_factory(is_rcrainfo_enabled=True)
        new_manifest_data = validated_data_factory(
            instance=manifest_factory(mtn="123456789ELC", status="NotAssigned"),
            serializer=ManifestSerializer,
        )
        new_manifest_data["mtn"] = new_mtn
        # Act
        new_manifest = create_manifest(data=new_manifest_data, username=user.username)
        # Assert
        assert isinstance(new_manifest, Manifest)
        assert new_manifest.mtn == new_mtn
