from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import CustomUserLoginSerializer, CustomUserRegisterSerializer
from django.contrib.auth import logout, authenticate
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token


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
        return Response({'message': 'User created successfully.'}, status=status.HTTP_200_OK)

    def perform_create(self, serializer):
        user = serializer.save(is_active=False)
        self.send_activation_email(user)

    def send_activation_email(self, user):
        pass


class LoginView(APIView):
    authentication_classes = [TokenAuthentication]
    serializer_class = CustomUserLoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={"request": request})
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data['user']
            if user:
                token, created = Token.objects.get_or_create(user=user)
                return Response({'token': [token.key], "Success": "Login SuccessFully"}, status=status.HTTP_201_CREATED)
            return Response({'Massage': 'Invalid Username and Password'}, status=401)


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({'message': 'Logout successful.'})
