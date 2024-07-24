from rest_framework import serializers


class HandlerBaseSerializer(serializers.ModelSerializer):
    """
    The Django Trak app base serializers class used to share functionality
    across trak app serializers universally.
    """

    def __str__(self):
        return f"{self.__class__.__name__}"

    def __repr__(self):
        return f"<{self.__class__.__name__}({self.data})>"

    def to_representation(self, instance):
        """
        Remove empty fields when serializing
        """
        data = super().to_representation(instance)
        for field in self.fields:
            try:
                if data[field] is None:
                    data.pop(field)
            except KeyError:
                pass
        return data
