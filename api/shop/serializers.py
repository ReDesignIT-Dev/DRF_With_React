from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import Product, ShoppingCartItem, Category, ShoppingCart
from decimal import Decimal


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('name', 'description', 'parent')


class SearchAssociatedCategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['name', 'slug', 'children']

    def get_children(self, obj):
        return obj.get('children', [])


class CategoryNameSlugSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name', 'slug']


class CategoryChildrenListSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()
    parent = CategoryNameSlugSerializer()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'children', 'parent']

    def get_children(self, obj):
        children = obj.children.all()
        return CategoryNameSlugSerializer(children, many=True).data


class CategoryProductListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['name', 'slug', 'price', 'image']


class CategoryTreeSerializer(serializers.ModelSerializer):
    parent_name = serializers.SerializerMethodField()
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('name', 'description', 'level', 'slug', 'parent_name', 'children')

    def get_children(self, obj):
        children = Category.objects.filter(parent=obj)
        return CategoryTreeSerializer(children, many=True).data

    def get_parent_name(self, obj):
        return obj.get_parent_name()

    def validate(self, data):
        name = data.get('name')
        parent = data.get('parent')

        if Category.objects.filter(name=name, parent=parent).exists():
            raise ValidationError("Category with this name in this parent category already exists.")

        return data


class ProductSerializer(serializers.ModelSerializer):
    description = serializers.CharField(min_length=2, max_length=500)
    is_on_sale = serializers.BooleanField(read_only=True, default=False)
    price = serializers.DecimalField(min_value=Decimal(0.01), max_value=Decimal(1000000.00), decimal_places=2,
                                     max_digits=None)
    slug = serializers.SlugField(read_only=True)

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
            'name', 'category', 'description', 'price', 'sale_start', 'sale_end', 'is_on_sale',
            'image', 'slug')


class ProductParentCategorySerializer(serializers.ModelSerializer):
    parent_category = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ('parent_category',)

    def get_parent_category(self, obj):
        parent_category = obj.category
        if parent_category:
            return {
                'name': parent_category.name,
                'slug': parent_category.slug,
            }
        return None


class ShoppingCartItemSerializer(serializers.ModelSerializer):
    product_slug = serializers.SlugRelatedField(
        queryset=Product.objects.all(),
        slug_field='slug',
        source='product',
        write_only=True
    )
    product = ProductSerializer(read_only=True)

    class Meta:
        model = ShoppingCartItem
        fields = ['product_slug', 'product', 'quantity', 'price']
        read_only_fields = ['price', 'product_slug', 'product']


class ShoppingCartSerializer(serializers.ModelSerializer):
    items = ShoppingCartItemSerializer(many=True, read_only=True)

    class Meta:
        model = ShoppingCart
        fields = ['items', 'status']
