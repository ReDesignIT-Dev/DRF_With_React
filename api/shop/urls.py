from django.urls import path
from .views import ProductList, ProductCreate, ProductRetrieveUpdateDestroy, ProductStats


urlpatterns = [
    path('products/', ProductList.as_view(), name='products'),
    path('products/create', ProductCreate.as_view(), name='create_product'),
    path('products/<int:id>/', ProductRetrieveUpdateDestroy.as_view(), name='update_delete_product'),
    path('products/<int:id>/stats', ProductStats.as_view(), name='product_stats')
]
