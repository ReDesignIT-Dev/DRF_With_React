from django.urls import path
from .views import ProductList, ProductCreate, ProductRetrieveUpdateDestroy, HomeView, ProductView, CategoriesView, \
    CategoryView

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('products/', ProductList.as_view(), name='products'),
    path('products/create', ProductCreate.as_view(), name='product_create'),
    path('products/<slug:slug>', ProductView.as_view(), name='product'),
    path('products/<slug:slug>/edit', ProductRetrieveUpdateDestroy.as_view(), name='product_update_delete'),
    path('categories/', CategoriesView.as_view(), name='categories'),
    path('category/', CategoryView.as_view(), name='category')
]
