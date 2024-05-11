from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import CustomUserLoginSerializer, CustomUserRegisterSerializer
from django.contrib.auth import login, logout
import secrets
import string


class RegisterView(generics.CreateAPIView):
    serializer_class = CustomUserRegisterSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        print(request.data)  # TODO delete after tests
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
        except ValidationError as e:
            errors = e.detail
            print("Validation errors:", errors)
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'User created successfully.'}, status=200)

    def perform_create(self, serializer):
        user = serializer.save(is_active=False)
        self.send_activation_email(user)

    def send_activation_email(self, user):
        pass


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CustomUserLoginSerializer(data=request.data)
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
