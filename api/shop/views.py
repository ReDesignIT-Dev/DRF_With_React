from rest_framework.generics import (
    ListAPIView,
    CreateAPIView,
    RetrieveUpdateDestroyAPIView, RetrieveAPIView,
)
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import AllowAny
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
    pass


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
