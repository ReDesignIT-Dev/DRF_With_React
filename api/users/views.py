from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError, MethodNotAllowed
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import CustomUserLoginSerializer, CustomUserRegisterSerializer, UserActivationSerializer, \
    PasswordResetSerializer, PasswordResetActivationSerializer, PasswordSetNewPasswordSerializer
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
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
        except ValidationError as e:
            errors = e.detail
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'message': 'User created successfully.'}, status=status.HTTP_200_OK)

    def perform_create(self, serializer):
        user = serializer.save(is_active=False)


class UserActivationView(APIView):
    permission_classes = [AllowAny]
    serializer_class = UserActivationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data={'token': kwargs.get('token')})
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User activated successfully.'}, status=status.HTTP_200_OK)
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
        if serializer.is_valid():
            user = serializer.validated_data['user']
            user.last_login = timezone.now().replace(microsecond=0)
            user.save(update_fields=['last_login'])
            data['user'] = user.username
        return data


class UserPasswordResetView(APIView):
    permission_classes = [AllowAny]
    serializer_class = PasswordResetSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            serializer.send_password_recovery_email()
            return Response({'message': 'Password reset sent to user email'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)


class UserPasswordResetActivationView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        serializer = self.get_serializer(data={'token': kwargs.get('token')})
        if serializer.is_valid():
            return Response({'message': 'Password recovery token OK.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, *args, **kwargs):
        data = {
            'token': kwargs.get('token'),
            'password': request.data.get('password'),
            'password_confirm': request.data.get('password_confirm'),
            'recaptcha': request.data.get('recaptcha')
        }
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Have a nice day with your new password :)'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)

    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        return serializer_class(*args, **kwargs)

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return PasswordResetActivationSerializer
        elif self.request.method == 'POST':
            return PasswordSetNewPasswordSerializer
        raise MethodNotAllowed(self.request.method)


class LogoutView(KnoxLogoutView):

    def post(self, request, format=None):
        try:
            # Attempt to delete the authentication token
            request._auth.delete()
            # Send the user_logged_out signal
            user_logged_out.send(sender=request.user.__class__, request=request, user=request.user)
            return Response(None, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            # If the user or token does not exist, return a 404 response
            return Response({"message": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # For any other exceptions, return a 500 response
            return Response({"message": "There might be a problem with the server"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
