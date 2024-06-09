from rest_framework.exceptions import ValidationError
from rest_framework.generics import (
    ListAPIView,
    CreateAPIView,
    RetrieveUpdateDestroyAPIView, RetrieveAPIView, get_object_or_404,
)
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from .serializers import ProductSerializer, CategorySerializer
from .models import Product, Category
from rest_framework.views import APIView
from rest_framework import status


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
    filter_backends = (DjangoFilterBackend, SearchFilter)
    filterset_fields = ("id",)
    search_fields = ("name", "description")
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


class CategoryView(APIView):
    def get(self, request, slug, format=None):
        category = get_object_or_404(Category, slug=slug)
        products = Product.objects.filter(categories=category)
        child_categories = category.children.all()
        category_serializer = CategorySerializer(category)
        product_serializer = ProductSerializer(products, many=True)
        child_category_serializer = CategorySerializer(child_categories, many=True)

        response_data = {
            'category': category_serializer.data,
            'products': product_serializer.data,
            'child_categories': child_category_serializer.data
        }

        return Response(response_data)


class CategoriesView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


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


class ShopAdminPanel(ListAPIView):
    permission_classes = [IsAdminUser]
    queryset = Product.objects.all()
    serializer_class = ProductSerializer