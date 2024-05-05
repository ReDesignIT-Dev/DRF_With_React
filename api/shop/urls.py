from django.urls import path
from .views import ProductList, ProductCreate, ProductEditView, HomeView, ProductView, CategoriesView, \
    CategoryView, CategoryCreateView, CategoryEditView

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('products/', ProductList.as_view(), name='products'),
    path('products/create', ProductCreate.as_view(), name='product_create'),
    path('products/<slug:slug>', ProductView.as_view(), name='product'),
    path('products/<slug:slug>/edit', ProductEditView.as_view(), name='product_edit'),
    path('categories/', CategoriesView.as_view(), name='categories'),
    path('categories/create', CategoryCreateView.as_view(), name='category_create'),
    path('categories/<slug:slug>', CategoryView.as_view(), name='category'),
    path('categories/<slug:slug>/edit', CategoryEditView.as_view(), name='category_edit')
]
