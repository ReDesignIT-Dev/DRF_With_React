from django.urls import path
from .views import ProductList, ProductCreate, ProductEditView, HomeView, ProductView, CategoriesView, \
    CategoryView, CategoryCreateView, CategoryEditView, ShopAdminPanel, ShopAdminPanelProducts

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('products/', ProductList.as_view(), name='products'),
    path('product/create/', ProductCreate.as_view(), name='product_create'),
    path('product/<slug:slug>', ProductView.as_view(), name='product'),
    path('product/<slug:slug>/edit/', ProductEditView.as_view(), name='product_edit'),
    path('categories/', CategoriesView.as_view(), name='categories'),
    path('category/create/', CategoryCreateView.as_view(), name='category_create'),
    path('category/<slug:slug>/', CategoryView.as_view(), name='category'),
    path('category/<slug:slug>/edit/', CategoryEditView.as_view(), name='category_edit'),
    path('shopping-admin-panel', ShopAdminPanel.as_view(), name='shop_admin_panel'),
    path('shopping-admin-panel/products/', ShopAdminPanelProducts.as_view(), name='shop_admin_panel_products'),
]
