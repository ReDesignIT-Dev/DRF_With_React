from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import CustomLoginSerializer, CustomUserSerializer
from django.contrib.auth import login, logout
import secrets
import string


class RegisterView(generics.CreateAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        print('Incoming JSON data:', request.data)
        return super().post(request, *args, **kwargs)

    def perform_create(self, serializer):
        print('Incoming data after serialization:', serializer.validated_data)
        user = serializer.save()
        # Add custom logic for sending activation email
        self.send_activation_email(user)

    def send_activation_email(self, user):
        # Add your custom logic for sending activation email
        pass


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CustomLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            login(request, user)
            return Response({'message': 'Login successful.'})
        return Response({'error': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({'message': 'Logout successful.'})


def generate_random_password():
    characters = string.ascii_letters + string.digits
    password = ''.join(secrets.choice(characters) for _ in range(12))
    return password


def generate_random_username():
    characters = string.ascii_letters + string.digits
    username = "TestUser."
    username += ''.join(secrets.choice(characters) for _ in range(7))
    return str(username)
