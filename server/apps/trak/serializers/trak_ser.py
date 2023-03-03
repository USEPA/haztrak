from rest_framework import serializers


class TrakBaseSerializer(serializers.ModelSerializer):
    """
    The Django Trak app base serializers class used to share functionality
    across trak app serializers universally.
    """

    def to_representation(self, instance):
        """
        Remove empty fields when serializing to JSON
        """
        data = super().to_representation(instance)
        for field in self.fields:
            try:
                if data[field] is None:
                    data.pop(field)
            except KeyError:
                pass
        return data
