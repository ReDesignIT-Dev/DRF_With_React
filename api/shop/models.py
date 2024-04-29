from django.db import models
from mptt.fields import TreeForeignKey

from api.users.models import CustomUser
from django.utils.text import slugify
from unidecode import unidecode
from image_cropping import ImageRatioField


class CommonFields(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, blank=True, default="")

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        ascii_name = unidecode(str(self.name))
        self.slug = f'{slugify(ascii_name)}-{self.pk}'
        super().save(*args, **kwargs)

    class Meta:
        abstract = True


class Category(CommonFields):
    id = models.AutoField(primary_key=True)
    description = models.TextField(blank=True)
    parent = TreeForeignKey('self', null=True, blank=True, related_name='children', on_delete=models.SET_NULL)

    class MPTTMeta:
        order_insertion_by = ['level']


class Product(CommonFields):
    id = models.AutoField(primary_key=True)
    description = models.TextField()
    price = models.FloatField()
    sale_start = models.DateTimeField(blank=True, null=True, default=None)
    sale_end = models.DateTimeField(blank=True, null=True, default=None)
    photo = models.ImageField(blank=True, null=True, default=None, upload_to="products")
    categories = models.ManyToManyField(Category, )
    cropping = ImageRatioField('image', '800x800')


class ShoppingCart(CommonFields):
    id = models.AutoField(primary_key=True)
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
