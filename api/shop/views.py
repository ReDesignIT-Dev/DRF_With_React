import math

from knox.auth import TokenAuthentication
from rest_framework.exceptions import ValidationError
from rest_framework.generics import (
    ListAPIView,
    CreateAPIView,
    RetrieveUpdateDestroyAPIView, RetrieveAPIView, get_object_or_404, UpdateAPIView, DestroyAPIView
)
from rest_framework.pagination import LimitOffsetPagination, PageNumberPagination
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from .serializers import ProductSerializer, CategoryTreeSerializer, CategoryCreateEditSerializer, \
    CategoryProductListSerializer, \
    SearchAssociatedCategorySerializer, ShoppingCartItemSerializer, ProductUpdateSerializer, \
    CategoryFlatSerializer
from .models import Product, Category, ShoppingCartItem, ShoppingCart
from rest_framework.views import APIView
from rest_framework import status, mixins, viewsets
from rest_framework.filters import SearchFilter
from django.db.models import Q
from urllib.parse import unquote


class TenPerPagePagination(PageNumberPagination):
    page_size = 10

    def get_paginated_response(self, data):
        total_pages = math.ceil(self.page.paginator.count / self.page_size)
        return Response({
            'count': self.page.paginator.count,
            'totalPages': total_pages,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'products': data
        })


class HomeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        return Response(
            {"message": "Hello, Home View! Yeah"}, status=status.HTTP_200_OK
        )


class ProductsPagination(LimitOffsetPagination):
    default_limit = 10
    max_limit = 100


class ProductList(ListAPIView):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()
    pagination_class = TenPerPagePagination

    def get_queryset(self):
        queryset = super().get_queryset()
        category_id = self.request.query_params.get('category')
        search = self.request.query_params.get('search', '').strip()

        if category_id:
            category = get_object_or_404(Category, id=category_id)
            descendants = category.get_descendants(include_self=True)
            queryset = queryset.filter(category__in=descendants).distinct().order_by('id')

        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )

        return queryset


class ProductCreate(CreateAPIView):
    serializer_class = ProductSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProductCRUDView(APIView):
    authentication_classes = (TokenAuthentication,)

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAuthenticated(), IsAdminUser()]

    def get(self, request, id=None, *args, **kwargs):
        product = get_object_or_404(Product, id=id)
        serializer = ProductSerializer(product)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id=None, *args, **kwargs):
        product = get_object_or_404(Product, id=id)
        serializer = ProductUpdateSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id=None, *args, **kwargs):
        product = get_object_or_404(Product, id=id)
        product.delete()
        return Response({"message": "Product deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


class ProductSearchView(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = CategoryProductListSerializer
    pagination_class = TenPerPagePagination

    def get_queryset(self):
        query_param = self.request.query_params.get('string', '')
        search_terms = unquote(query_param).split()
        print(search_terms)
        if not search_terms:
            return Product.objects.none()

        query = Q()
        for term in search_terms:
            query |= Q(name__icontains=term) | Q(description__icontains=term)

        return Product.objects.filter(query).distinct().order_by('id')

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        # fallback (if pagination is disabled)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class CategoriesSearchAssociatedView(ListAPIView):
    serializer_class = SearchAssociatedCategorySerializer

    def get_queryset(self):
        query_param = self.request.query_params.get('string', '')
        search_terms = unquote(query_param).split()

        if not search_terms:
            return Category.objects.none()

        query = Q()
        for term in search_terms:
            query |= Q(name__icontains=term) | Q(description__icontains=term)

        products = Product.objects.filter(query)
        product_categories = Category.objects.filter(id__in=products.values('category_id')).distinct()

        product_counts = {}
        for product in products:
            category = product.category
            if category.id in product_counts:
                product_counts[category.id] += 1
            else:
                product_counts[category.id] = 1

        return product_categories, product_counts

    def list(self, request, *args, **kwargs):
        product_categories, product_counts = self.get_queryset()
        processed_categories = set()

        full_trees = []
        for category in product_categories:
            root_category = category
            while root_category.parent:
                root_category = root_category.parent

            tree = build_category_tree(root_category, product_categories, product_counts, processed_categories)
            if tree and tree not in full_trees:
                full_trees.append(tree)

        return Response(full_trees, status=status.HTTP_200_OK)


def get_full_category_tree(category):
    parents = []
    while category.parent:
        parents.append(category.parent)
        category = category.parent
    return list(reversed(parents))


def build_category_tree(category, product_categories, product_counts, processed_categories):
    if category.id in processed_categories:
        return None

    processed_categories.add(category.id)

    product_count = product_counts.get(category.id, 0)

    children_trees = []
    for child in category.children.all():
        child_tree = build_category_tree(child, product_categories, product_counts, processed_categories)
        if child_tree:
            children_trees.append(child_tree)
            product_count += child_tree['product_count']

    if category in product_categories or children_trees:
        return {
            'name': category.name,
            'slug': category.slug,
            'product_count': product_count,
            'children': children_trees
        }

    return None


class CategoryView(APIView):
    def get(self, request, id, format=None):
        category = get_object_or_404(Category, id=id)
        products = Product.objects.filter(category=category)
        child_categories = category.children.all()
        category_serializer = CategoryTreeSerializer(category)
        product_serializer = ProductSerializer(products, many=True)
        child_category_serializer = [child.id for child in child_categories]

        response_data = {
            'category': category_serializer.data,
            'products': product_serializer.data,
            'child_categories': child_category_serializer
        }

        return Response(response_data)

class CategoryCRUDView(APIView):

    def get_permissions(self):
        if self.request.method == "GET":
            return [AllowAny()]
        return [IsAuthenticated(), IsAdminUser()]

    def get(self, request, id=None, *args, **kwargs):
        if id:
            category = get_object_or_404(Category, id=id)
            products = Product.objects.filter(category=category)
            child_categories = category.children.all()
            category_serializer = CategoryTreeSerializer(category)
            product_serializer = ProductSerializer(products, many=True)
            child_category_serializer = [child.id for child in child_categories]

            response_data = {
                'category': category_serializer.data,
                'products': product_serializer.data,
                'child_categories': child_category_serializer
            }
            return Response(response_data)
        else:
            categories = Category.objects.all()
            serializer = CategoryTreeSerializer(categories, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        serializer = CategoryCreateEditSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, id=None, *args, **kwargs):
        category = get_object_or_404(Category, id=id)
        serializer = CategoryCreateEditSerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id=None, *args, **kwargs):
        category = get_object_or_404(Category, id=id)
        if category.parent is None:
            has_children = category.children.exists()
            has_products = category.products.exists()
            if has_children or has_products:
                return Response(
                    {"error": "Cannot delete a root category with child categories or associated products."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        category.delete()
        return Response({"message": "Category deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


class CategoryTreeView(ListAPIView):
    queryset = Category.objects.filter(parent__isnull=True)
    serializer_class = CategoryTreeSerializer


class CategoryFlatView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategoryFlatSerializer


class CategoryCreateView(CreateAPIView):
    serializer_class = CategoryCreateEditSerializer
    permission_classes = [IsAdminUser]


class CategoryEditView(RetrieveUpdateDestroyAPIView):
    lookup_field = 'id'
    serializer_class = CategoryCreateEditSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        id = self.kwargs.get('id')
        return Category.objects.filter(id=id)

    def perform_destroy(self, instance):
        if instance.parent is None:
            has_children = instance.children.exists()
            has_products = Product.objects.filter(categories=instance).exists()
            if has_children or has_products:
                raise ValidationError("Cannot delete a root category that has child categories or associated products.")
        super().perform_destroy(instance)


class ShopAdminPanel(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        response_data = {
            'products_quantity': Product.objects.all().count(),
            'categories_quantity': Category.objects.all().count(),
        }
        return Response(response_data)


class ShopAdminPanelProducts(ListAPIView):
    permission_classes = [IsAdminUser]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [SearchFilter]
    search_fields = ['name']


class ShoppingCartItemViewSet(
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet
):
    serializer_class = ShoppingCartItemSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        cart, _ = ShoppingCart.objects.get_or_create(owner=self.request.user, status='active')
        return cart.items.all()

    def perform_create(self, serializer):
        cart, _ = ShoppingCart.objects.get_or_create(
            owner=self.request.user, status='active'
        )
        product = serializer.validated_data['product']

        try:
            cart_item = ShoppingCartItem.objects.get(
                shopping_cart=cart, product=product
            )
            cart_item.quantity += serializer.validated_data['quantity']
            cart_item.save()
        except ShoppingCartItem.DoesNotExist:
            serializer.save(shopping_cart=cart, price=product.price)

    def get_object(self):
        product_id = self.kwargs['pk']
        cart, _ = ShoppingCart.objects.get_or_create(owner=self.request.user, status='active')
        return get_object_or_404(ShoppingCartItem, shopping_cart=cart, product_id=product_id)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
