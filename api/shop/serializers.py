from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .models import Product, ShoppingCartItem, Category
from decimal import Decimal


class CartItemSerializer(serializers.ModelSerializer):
    quantity = serializers.IntegerField(min_value=1, max_value=100)

    class Meta:
        model = ShoppingCartItem
        fields = ('product', 'quantity')


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('name', 'description', 'parent', 'level')

    def validate(self, data):
        name = data.get('name')
        parent = data.get('parent')

        if Category.objects.filter(name=name, parent=parent).exists():
            raise ValidationError("Category with this name in this parent category already exists.")

        return data


class ProductSerializer(serializers.ModelSerializer):
    category_names = serializers.SerializerMethodField()
    description = serializers.CharField(min_length=2, max_length=500)
    is_on_sale = serializers.BooleanField(read_only=True, default=False)
    cart_items = serializers.SerializerMethodField()
    price = serializers.DecimalField(min_value=Decimal(0.01), max_value=Decimal(1000000.00), decimal_places=2,
                                     max_digits=None)

    sale_start = serializers.DateTimeField(
        required=False,
        input_formats=['%Y-%m-%d %H:%M'],
        format='%Y-%m-%d %H:%M',
        allow_null=True,
        help_text='Accepted format is "2000-01-01 12:00"',
        style={'input_type': 'text', 'placeholder': '2000-12-12 12:00'},
        default=None,
    )
    sale_end = serializers.DateTimeField(
        required=False,
        input_formats=['%Y-%m-%d %H:%M'],
        format='%Y-%m-%d %H:%M',
        allow_null=True,
        help_text='Accepted format is "2000-01-01 12:00"',
        style={'input_type': 'text', 'placeholder': '2000-12-12 12:00'},
        default=None,
    )

    class Meta:
        model = Product
        fields = (
            'name', 'categories', 'description', 'price', 'sale_start', 'sale_end', 'is_on_sale',
            'cart_items', 'image', 'category_names',)

    def get_cart_items(self, instance):
        items = ShoppingCartItem.objects.filter(product=instance)
        return CartItemSerializer(items, many=True).data

    def get_category_names(self, instance):
        return [category.name for category in instance.categories.all()]
