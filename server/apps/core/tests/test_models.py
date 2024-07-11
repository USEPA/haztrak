import pytest
from django.contrib.contenttypes.models import ContentType

from apps.core.models import Permission, Role


class TestPermissionModel:
    mock_app_label = "test_app"
    mock_model = "test_model"

    @pytest.fixture
    def mock_content_type(self):
        return ContentType.objects.create(app_label=self.mock_app_label, model=self.mock_model)

    @pytest.mark.django_db
    def test_saves_new_permissions(self, mock_content_type):
        permission_name = "test_permission"
        permission = Permission.objects.create(
            content_type=mock_content_type, content_type_id=1, name=permission_name
        )

        saved_permission = Permission.objects.get(name=permission_name)

        assert saved_permission.name == permission_name
        assert saved_permission.id == permission.id


class TestRoleModel:
    @pytest.mark.django_db
    def test_role_with_multiple_permissions(self, permission_factory):
        permission1 = permission_factory(content_type_id=1)
        permission2 = permission_factory(content_type_id=2)
        role = Role.objects.create(name="test_role")
        role.permissions.add(permission1, permission2)
        assert role.permissions.count() == 2
        assert permission1 in role.permissions.all()
        assert permission2 in role.permissions.all()

    @pytest.mark.django_db
    def test_role_str_representation(self):
        role = Role.objects.create(name="test_role")
        assert str(role) == "test_role"
