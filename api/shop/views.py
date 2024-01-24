from rest_framework.generics import ListAPIView
from django_filters.rest_framework import DjangoFilterBackend

from .serializers import ProductSerializer
from .models import Product

class ProductList(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = (DjangoFilterBackend, )
    filterset_fields = ('id', )