from rest_framework import serializers

from api.home.models import Product


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('id', 'name', 'description', 'price', 'sale_start', 'sale_end')

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['is_one_sale'] = instance.is_on_sale()
        data['current_price'] = instance.current_price()
        return data