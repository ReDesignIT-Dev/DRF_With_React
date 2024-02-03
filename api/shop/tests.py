import os.path
from django.conf import settings
from rest_framework.test import APITestCase
from .models import Product


def create_product(api_client, name, description, price):
    product_attrs = {
        "name": name,
        "description": description,
        "price": price,
    }
    response = api_client.post("/products/create", product_attrs)
    return response, product_attrs


class ProductCreateTestCase(APITestCase):
    def test_create_product(self):
        initial_product_count = Product.objects.count()
        response, product_attrs = create_product(
            self.client, "New Product 1", "Awesome product", "123.45"
        )
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


class ProductDestroyTestCase(APITestCase):
    def test_delete_product(self):

        response, _ = create_product(
            self.client, "New Product 2", "Awesome product", "123.45"
        )
        initial_product_count = Product.objects.count()
        product_id = Product.objects.first().id
        self.client.delete("/products/{}/".format(product_id))
        self.assertEqual(
            Product.objects.count(),
            initial_product_count - 1,
        )
        self.assertRaises(
            Product.DoesNotExist,
            Product.objects.get,
            id=product_id,
        )


class ProductListTestCase(APITestCase):
    def test_list_products(self):
        products_count = Product.objects.count()
        response = self.client.get("/products/")
        self.assertIsNone(response.data["next"])
        self.assertIsNone(response.data["previous"])
        self.assertEqual(response.data["count"], products_count)
        self.assertEqual(len(response.data["results"]), products_count)


class ProductUpdateTestCase(APITestCase):
    def test_update_product(self):

        response, _ = create_product(
            self.client, "First name which will be changed", "Awesome product", "123.45"
        )
        product = Product.objects.first()
        response = self.client.patch(
            "/products/{}/".format(product.id),
            {
                "name": "New Product 3",
                "description": "Awesome product after the change",
                "price": "999",
            },
            format="json",
        )
        updated = Product.objects.get(id=product.id)
        self.assertEqual(updated.name, "New Product 3")

    def test_upload_product_photo(self):
        response, _ = create_product(
            self.client, "The object for photo test", "Awesome product", "123.45"
        )
        product = Product.objects.first()
        original_photo = product.photo
        photo_path = os.path.join(
            settings.MEDIA_ROOT,
            "products",
            "vitamin-iron.jpg",
        )
        with open(photo_path, "rb") as photo_data:
            response = self.client.patch(
                "/products/{}/".format(product.id),
                {"photo": photo_data},
                format="multipart",
            )

        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(response.data["photo"], original_photo)

        try:
            updated = Product.objects.get(id=product.id)
            expected_photo = os.path.join(
                settings.MEDIA_ROOT,
                "products",
                "vitamin-iron",
            )
            self.assertTrue(updated.photo.path.startswith(expected_photo))
        finally:
            os.remove(updated.photo.path)
