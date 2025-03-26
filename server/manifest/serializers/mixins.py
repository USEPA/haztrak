"""Mixins for serializers."""

from rest_framework import serializers


class RemoveEmptyFieldsMixin(serializers.Serializer):
    """Mixin to remove empty fields when serializing."""

    def remove_empty_fields(self, data):
        """Remove empty fields when serializing."""
        for field in self.fields:
            try:
                if data[field] is None:
                    data.pop(field)
            except KeyError:
                pass
        return data

    def to_representation(self, instance):
        """Remove empty fields when serializing."""
        data = super().to_representation(instance)
        return self.remove_empty_fields(data)
