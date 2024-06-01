from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import CustomUserLoginSerializer, CustomUserRegisterSerializer, UserActivationSerializer, \
    PasswordResetSerializer, PasswordResetActivationSerializer
from knox.views import LoginView as KnoxLoginView
from knox.views import LogoutView as KnoxLogoutView
from knox.views import LogoutAllView as KnoxLogoutAllView
from knox.auth import TokenAuthentication
from rest_framework.authentication import BasicAuthentication
from django.contrib.auth.signals import user_logged_out


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


class UserActivationView(APIView):
    permission_classes = [AllowAny]
    serializer_class = UserActivationSerializer

    def get(self, request, *args, **kwargs):
        serializer = self.serializer_class(data={'token': kwargs.get('token')})
        if serializer.is_valid():
            serializer.save()
            return Response({'detail': 'User activated successfully.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)


class UserPasswordResetView(APIView):
    permission_classes = [AllowAny]
    serializer_class = PasswordResetSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.send_password_recovery_email()
            return Response({'detail': 'Password reset sent to user email'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)


class UserPasswordResetActivationView(APIView):
    permission_classes = [AllowAny]
    serializer_class = PasswordResetActivationSerializer

    def get(self, request, *args, **kwargs):
        serializer = self.serializer_class(data={'token': kwargs.get('token')})
        if serializer.is_valid():
            return Response({'detail': 'Password recovery token OK.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)


class LoginView(KnoxLoginView):
    authentication_classes = [BasicAuthentication]
    serializer_class = CustomUserLoginSerializer

    def get_post_response_data(self, request, token, instance):
        data = {
            'expiry': self.format_expiry_datetime(instance.expiry),
            'token': token
        }
        serializer = self.serializer_class(data=request.data, context={"request": request})
        if serializer.is_valid(raise_exception=True):
            user = serializer.validated_data['user']
            data['user'] = user.username
        return data


class LogoutView(KnoxLogoutView):

    def post(self, request, format=None):
        request._auth.delete()
        user_logged_out.send(sender=request.user.__class__,
                             request=request, user=request.user)
        return Response(None, status=status.HTTP_200_OK)


class LogoutAllView(KnoxLogoutAllView):

    def post(self, request, format=None):
        request.user.auth_token_set.all().delete()
        user_logged_out.send(sender=request.user.__class__,
                             request=request, user=request.user)
        return Response(None, status=status.HTTP_200_OK)


class ForLoggedInOnlyView(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        content = {
            'foo': 'bar'
        }
        return Response(content)
