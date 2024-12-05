from django.contrib import admin
from .models import Category, Product, ProductImage, ShoppingCart, ShoppingCartItem, Order, OrderItem

# Register your models here.

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'parent', 'description')
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'sale_start', 'sale_end')
    search_fields = ['name', 'category__name']
    list_filter = ['category', 'price']

@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('product', 'position', 'image', 'alt_text')
    search_fields = ['product__name']
    list_filter = ['product']

@admin.register(ShoppingCart)
class ShoppingCartAdmin(admin.ModelAdmin):
    list_display = ('owner', 'status')
    search_fields = ['owner__username']

@admin.register(ShoppingCartItem)
class ShoppingCartItemAdmin(admin.ModelAdmin):
    list_display = ('shopping_cart', 'product', 'quantity', 'price')
    search_fields = ['shopping_cart__owner__username', 'product__name']
    list_filter = ['shopping_cart', 'product']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('user', 'status', 'total', 'created_at', 'updated_at')
    search_fields = ['user__username']
    list_filter = ['status']

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'quantity', 'price')
    search_fields = ['order__user__username', 'product__name']
    list_filter = ['order', 'product']
