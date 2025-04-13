from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import Product, ShoppingCartItem, Category, ShoppingCart, ProductImage
from decimal import Decimal


class ProductImageSerializer(serializers.ModelSerializer):
    src = serializers.SerializerMethodField()
    altText = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'src', 'altText', 'position']

    def get_src(self, obj):
        request = self.context.get('request')
        src = obj.image.url if obj.image else ""

        if request:
            src = request.build_absolute_uri(src)

        return src

    def get_altText(self, obj):
        return obj.alt_text if obj.alt_text else ""  # Return altText as a string, not a dictionary


class CategoryCreateEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('name', 'short_name', 'description', 'parent', 'image')

    def validate(self, data):
        name = data.get('name')
        parent = data.get('parent')

        if Category.objects.filter(name=name, parent=parent).exists():
            raise ValidationError("Category with this name in this parent category already exists.")

        return data


class SearchAssociatedCategorySerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['name', 'id', 'children']

    def get_children(self, obj):
        return obj.get('children', [])


class CategoryProductListSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ['name', 'slug', 'id', 'price', 'images']


class CategoryTreeSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('id', 'name', 'slug', 'children')

    def get_children(self, obj):
        children = Category.objects.filter(parent=obj)
        return CategoryTreeSerializer(children, many=True).data if children else None


class CategoryFlatSerializer(serializers.ModelSerializer):
    parent_id = serializers.SerializerMethodField()
    children = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()
    ancestors = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = (
            'id', 'name', 'short_name', 'slug', 'image', 'description', 'level', 'parent_id', 'children',
            'product_count', 'ancestors')

    def get_parent_id(self, obj):
        return obj.parent.id if obj.parent else None

    def get_children(self, obj):
        return list(Category.objects.filter(parent=obj).values_list('id', flat=True))

    def get_product_count(self, obj):
        product_count = obj.products.count()

        for descendant in obj.get_descendants():
            product_count += descendant.products.count()

        return product_count

    def get_ancestors(self, obj):
        ancestors = obj.get_ancestors(ascending=True, include_self=False).values('name', 'short_name', 'slug')
        return ancestors


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )
    description = serializers.CharField(allow_blank=True, style={'base_template': 'textarea.html'})
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
        fields = ('id', 'name', 'category', 'description', 'images','uploaded_images',  'images', 'price', 'sale_start', 'sale_end',
                  'is_on_sale', 'slug')

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        product = Product.objects.create(**validated_data)

        for image in uploaded_images:
            ProductImage.objects.create(product=product, image=image)

        return product


class ProductUpdateSerializer(serializers.ModelSerializer):
    images = serializers.ListField(
        child=serializers.ImageField(),
        required=False,
        write_only=True,
        help_text="A list of images to be added to the product",
    )
    image_urls = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ('name', 'category', 'description', 'images', 'image_urls', 'price', 'sale_start', 'sale_end')
        extra_kwargs = {
            'name': {'required': False},
            'description': {'required': False},
            'price': {'required': False},
        }

    def get_image_urls(self, obj):
        return [image.image.url for image in obj.images.all() if image.image and image.image.name]

    def update(self, instance, validated_data):
        new_images = validated_data.pop('images', [])
        instance.images.all().delete()
        for img in new_images:
            ProductImage.objects.create(product=instance, image=img)
        instance = super().update(instance, validated_data)
        return instance


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
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        source='product',
        write_only=True
    )

    product = ProductSerializer(read_only=True)

    class Meta:
        model = ShoppingCartItem
        fields = ['product_id', 'quantity', 'product']
        read_only_fields = ['product']


class ShoppingCartSerializer(serializers.ModelSerializer):
    items = ShoppingCartItemSerializer(many=True, read_only=True)

    class Meta:
        model = ShoppingCart
        fields = ['items']
