from rest_framework.test import APITestCase

from .models import Product


class ProductCreateTestCase(APITestCase):
    def test_create_product(self):
        initial_product_count = Product.objects.count()
        product_attrs = {
            "name": "New Product",
            "description": "Awesome product",
            "price": "123.45",
        }
        response = self.client.post("/products/create", product_attrs)
        if response.status_code != 201:
            print(response.data)
        self.assertEqual(
            Product.objects.count(),
            initial_product_count + 1,
        )
        for attrs, expected_value in product_attrs.items():
            self.assertEqual(response.data["is_on_sale"], False)
            self.assertEqual(
                response.data["current_price"], float(product_attrs["price"])
            )
