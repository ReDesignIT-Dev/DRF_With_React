from django.db import models
from mptt.models import MPTTModel, TreeForeignKey
from api.users.models import CustomUser
from django.utils.text import slugify


class CommonFields(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.pk:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

        new_slug = f'{slugify(self.name)}-{self.pk}'
        if self.slug != new_slug:
            self.slug = new_slug
            self.save()

    class Meta:
        abstract = True


class Category(CommonFields, MPTTModel):
    description = models.TextField(blank=True, null=True)
    parent = TreeForeignKey('self', null=True, blank=True, related_name='children',
                            on_delete=models.SET_NULL)

    class MPTTMeta:
        order_insertion_by = ['level']

    def delete(self, *args, **kwargs):
        parent_category = self.parent
        for product in Product.objects.filter(categories=self):
            product.category.remove(self)
            product.category.add(parent_category)
        self.children.update(parent=self.parent)
        super().delete(*args, **kwargs)

    def get_parent_name(self):
        return self.parent.name if self.parent else None


def get_default_category():
    default_category = Category.objects.filter(level=0).first()
    if not default_category:
        default_category = Category.objects.create(name="Shop", parent=None)
    return default_category.id


class Product(CommonFields):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE,
                                 default=get_default_category)
    image = models.ImageField(blank=True, default='shop_default_image.jpg', upload_to="products")
    description = models.CharField(max_length=500, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    sale_start = models.DateTimeField(null=True, blank=True)
    sale_end = models.DateTimeField(null=True, blank=True)


class ShoppingCart(CommonFields):
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE)


class ShoppingCartItem(models.Model):
    shopping_cart = models.ForeignKey(
        ShoppingCart,
        related_name="items",
        related_query_name="item",
        on_delete=models.CASCADE,
    )
    product = models.ForeignKey(Product, related_name="+", on_delete=models.CASCADE)
    quantity = models.IntegerField()
