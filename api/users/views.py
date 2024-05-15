from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import CustomUserLoginSerializer, CustomUserRegisterSerializer
from django.contrib.auth import logout
# from rest_framework.authentication import TokenAuthentication
# from rest_framework.authtoken.models import Token
from django.contrib.auth import login
from knox.views import LoginView as KnoxLoginView
from knox.views import LogoutView as KnoxLogoutView
from knox.auth import TokenAuthentication
from rest_framework.authentication import BasicAuthentication


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
            print("Validation errors:", errors)  # TODO delete after tests
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'User created successfully.'}, status=status.HTTP_200_OK)

    def perform_create(self, serializer):
        user = serializer.save(is_active=False)
        self.send_activation_email(user)

    def send_activation_email(self, user):
        pass


class LoginView(KnoxLoginView):
    authentication_classes = [BasicAuthentication]
    serializer_class = CustomUserLoginSerializer  # serializer taken from knox in settings.py

    def get_post_response_data(self, request, token, instance):
        serializer = self.serializer_class(data=request.data, context={"request": request})

        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data['user']
            data = {'expiry': self.format_expiry_datetime(instance.expiry), 'token': token, 'user': user.username}
            return data
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(KnoxLogoutView):
    def get_post_response(self, request):
        return Response({"bye-bye": request.user.username}, status=200)


class ForLoggedInOnlyView(APIView):
    authentication_classes = (TokenAuthentication,)

    permission_classes = (IsAuthenticated,)

    def get(self, request):
        content = {
            'foo': 'bar'
        }
        return Response(content)
