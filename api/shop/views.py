from rest_framework.exceptions import ValidationError
from rest_framework.generics import (
    ListAPIView,
    CreateAPIView,
    RetrieveUpdateDestroyAPIView, RetrieveAPIView, get_object_or_404,
)
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from .serializers import ProductSerializer, CategoryTreeSerializer, CategorySerializer, CategoryChildrenListSerializer, \
    CategoryProductListSerializer, CategoryParentsListSerializer, ProductParentCategorySerializer, \
    SearchAssociatedCategorySerializer
from .models import Product, Category
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.filters import SearchFilter
from django.db.models import Q
from urllib.parse import unquote


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
    permission_classes = [AllowAny]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = ProductsPagination

    def get_queryset(self):
        on_sale = self.request.query_params.get("on_sale", None)
        if on_sale is None:
            return super().get_queryset()
        queryset = Product.objects.all()
        if on_sale.lower() == "true":
            from django.utils import timezone

            now = timezone.now()
            return queryset.filter(
                sale_start__lte=now,
                sale_end__gte=now,
            )
        return queryset


class ProductCreate(CreateAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductEditView(RetrieveUpdateDestroyAPIView):
    lookup_field = "slug"
    serializer_class = ProductSerializer
    queryset = Product.objects.all()


class ProductView(RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'


class ProductParentCategoryView(RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductParentCategorySerializer
    lookup_field = 'slug'


class ProductSearchView(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = CategoryProductListSerializer

    def get_queryset(self):
        query_param = self.request.query_params.get('string', '')
        search_terms = unquote(query_param).split()

        if not search_terms:
            return Product.objects.none()

        query = Q()
        for term in search_terms:
            query |= Q(name__icontains=term) | Q(description__icontains=term)

        return Product.objects.filter(query)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({'products': serializer.data}, status=status.HTTP_200_OK)


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

        return Response({'categories': full_trees}, status=status.HTTP_200_OK)


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
            'id': category.id,
            'name': category.name,
            'product_count': product_count,
            'children': children_trees
        }

    return None


class CategoryView(APIView):
    def get(self, request, slug, format=None):
        category = get_object_or_404(Category, slug=slug)
        products = Product.objects.filter(category=category)
        child_categories = category.children.all()
        category_serializer = CategoryTreeSerializer(category)
        product_serializer = ProductSerializer(products, many=True)
        child_category_serializer = CategoryTreeSerializer(child_categories, many=True)

        response_data = {
            'category': category_serializer.data,
            'products': product_serializer.data,
            'child_categories': child_category_serializer.data
        }

        return Response(response_data)


class CategoryChildrenView(RetrieveAPIView):
    queryset = Category.objects.all()
    serializer_class = CategoryChildrenListSerializer
    lookup_field = 'slug'

    def get_object(self):
        slug = self.kwargs.get("slug")
        return get_object_or_404(Category, slug=slug)


class CategoryProductsView(RetrieveAPIView):
    queryset = Category.objects.all()
    serializer_class = CategoryProductListSerializer
    lookup_field = 'slug'

    def get_object(self):
        slug = self.kwargs.get("slug")
        return get_object_or_404(Category, slug=slug)

    def retrieve(self, request, *args, **kwargs):
        category = self.get_object()
        descendants = category.get_descendants(include_self=True)
        products = Product.objects.filter(category__in=descendants).distinct()
        serializer = self.get_serializer(products, many=True)
        return Response({'products': serializer.data})


class CategoryParentsView(RetrieveAPIView):
    queryset = Category.objects.all()
    serializer_class = CategoryParentsListSerializer
    lookup_field = 'slug'

    def get_object(self):
        slug = self.kwargs.get("slug")
        return get_object_or_404(Category, slug=slug)

    def retrieve(self, request, *args, **kwargs):
        category = self.get_object()
        ancestors = category.get_ancestors(include_self=True)
        ancestors_serializer = self.get_serializer(ancestors, many=True)
        return Response({'ancestors': ancestors_serializer.data})


class CategoriesView(ListAPIView):
    queryset = Category.objects.filter(parent__isnull=True)
    serializer_class = CategoryTreeSerializer


class CategoryCreateView(CreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class CategoryEditView(RetrieveUpdateDestroyAPIView):
    lookup_field = "slug"
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        slug = self.kwargs.get('slug')
        return Category.objects.filter(slug=slug)

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
