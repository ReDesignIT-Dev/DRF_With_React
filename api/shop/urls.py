from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    ProductList, ProductCreate, ProductCRUDView, HomeView, CategoryTreeView,
    CategoryCRUDView, ShopAdminPanel, ShopAdminPanelProducts,
    ProductSearchView, CategoriesSearchAssociatedView, CategoryFlatView, ShoppingCartItemViewSet
)

router = DefaultRouter()
router.register(r'cart', ShoppingCartItemViewSet, basename='cart')

urlpatterns = [
    path('', include(router.urls)),
    path('', HomeView.as_view(), name='home'),
    path('search', ProductSearchView.as_view(), name='search'),
    path('search-associated-categories', CategoriesSearchAssociatedView.as_view(), name='associated_categories'),
    path('products', ProductList.as_view(), name='products'),
    path('product/create', ProductCreate.as_view(), name='product_create'),
    path('product/<int:id>', ProductCRUDView.as_view(), name='product_crud'),
    path('category/tree', CategoryTreeView.as_view(), name='tree_categories'),
    path('category/flat', CategoryFlatView.as_view(), name='flat_categories'),
    path('category/<int:id>', CategoryCRUDView.as_view(), name='category_crud'),
    path('shopping-admin-panel', ShopAdminPanel.as_view(), name='shop_admin_panel'),
    path('shopping-admin-panel/products', ShopAdminPanelProducts.as_view(), name='shop_admin_panel_products'),
]