from django.db import models
from mptt.fields import TreeForeignKey
from api.users.models import CustomUser
from django.utils.text import slugify
from image_cropping import ImageRatioField


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


class Category(CommonFields):
    description = models.TextField(blank=True)
    parent = TreeForeignKey('self', null=True, blank=True, related_name='children', on_delete=models.SET_NULL)

    class MPTTMeta:
        order_insertion_by = ['level']


class Product(CommonFields):
    description = models.TextField()
    price = models.FloatField()
    sale_start = models.DateTimeField(blank=True, null=True, default=None)
    sale_end = models.DateTimeField(blank=True, null=True, default=None)
    image = models.ImageField(blank=True, default='shop_default_image.jpg', upload_to="products")
    categories = models.ManyToManyField(Category, )
    cropping = ImageRatioField('image', '800x800')


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
