from django.urls import path
from .views import ProductList, ProductCreate, ProductEditView, HomeView, ProductView, CategoryTreeView, \
    CategoryView, CategoryCreateView, CategoryEditView, ShopAdminPanel, ShopAdminPanelProducts, CategoryChildrenView, \
    CategoryProductsView, CategoryParentsView, ProductParentCategoryView, ProductSearchView, \
    CategoriesSearchAssociatedView, ShoppingCartItemCreateView, \
    ShoppingCartItemUpdateView, ShoppingCartItemDestroyView, ShoppingCartItemListView, CategoryFlatView

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('search', ProductSearchView.as_view(), name='search'),
    path('search-associated-categories', CategoriesSearchAssociatedView.as_view(), name='associated_categories'),
    path('products', ProductList.as_view(), name='products'),
    path('product/create', ProductCreate.as_view(), name='product_create'),
    path('product/<int:id>', ProductView.as_view(), name='product'),
    path('product/<int:id>/edit', ProductEditView.as_view(), name='product_edit'),
    path('product/<int:id>/parent-category', ProductParentCategoryView.as_view(), name='parent-category-detail'),
    path('category/tree', CategoryTreeView.as_view(), name='tree_categories'),
    path('category/flat', CategoryFlatView.as_view(), name='flat_categories'),
    path('category/create', CategoryCreateView.as_view(), name='category_create'),
    path('category/<int:id>', CategoryView.as_view(), name='category'),
    path('category/<int:id>/edit', CategoryEditView.as_view(), name='category_edit'),
    path('category/<int:id>/children', CategoryChildrenView.as_view(), name='category_children'),
    path('category/<int:id>/products', CategoryProductsView.as_view(), name='category_products'),
    path('category/<int:id>/parents', CategoryParentsView.as_view(), name='category_parents'),
    path('shopping-admin-panel', ShopAdminPanel.as_view(), name='shop_admin_panel'),
    path('shopping-admin-panel/products', ShopAdminPanelProducts.as_view(), name='shop_admin_panel_products'),
    path('cart', ShoppingCartItemListView.as_view(), name='shopping-cart'),
    path('cart/add', ShoppingCartItemCreateView.as_view(), name='add-cart-item'),
    path('cart/update', ShoppingCartItemUpdateView.as_view(), name='update-cart-item'),
    path('cart/delete', ShoppingCartItemDestroyView.as_view(), name='delete-cart-item')
]
