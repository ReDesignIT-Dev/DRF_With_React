from django.core.validators import MinValueValidator
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
        if not self.slug:
            temp_slug = slugify(self.name)
            counter = 1
            while Product.objects.filter(slug=temp_slug).exists():
                temp_slug = f'{slugify(self.name)}-{counter}'
                counter += 1
            self.slug = temp_slug

        super().save(*args, **kwargs)

        final_slug = f'{slugify(self.name)}-{self.pk}'

        if self.slug != final_slug:
            self.slug = final_slug
            self.save(update_fields=['slug'])

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
    status = models.CharField(max_length=20,
                              choices=[('active', 'Active'), ('completed', 'Completed'), ('abandoned', 'Abandoned')],
                              default='active')


class ShoppingCartItem(models.Model):
    shopping_cart = models.ForeignKey(
        ShoppingCart,
        related_name="items",
        related_query_name="item",
        on_delete=models.CASCADE,
    )
    product = models.ForeignKey(Product, related_name="cart_items", on_delete=models.CASCADE)
    quantity = models.IntegerField(validators=[MinValueValidator(1)])
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Store the price at the time of adding to the cart

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['shopping_cart', 'product'], name='unique_cart_item')
        ]

    def subtotal(self):
        return self.quantity * self.price


from django.db import models
from django.conf import settings


class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=[
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ], default='processing')
    total = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_address = models.TextField()
    billing_address = models.TextField()

    def __str__(self):
        return f"Order #{self.id} by {self.user}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='+', on_delete=models.SET_NULL, null=True)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Price at the time of order

    def subtotal(self):
        return self.quantity * self.price
