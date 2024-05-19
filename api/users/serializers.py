from rest_framework.serializers import Serializer, ModelSerializer, CharField, ValidationError, EmailField
from .email_sender import EmailSender
from .models import CustomUser
from django.contrib.auth import authenticate
from drf_recaptcha.fields import ReCaptchaV2Field
from django.contrib.auth.password_validation import validate_password
from django.urls import reverse
from django.core.exceptions import ObjectDoesNotExist


class V2Serializer(Serializer):
    recaptcha = ReCaptchaV2Field()


class UserActivationSerializer(Serializer):
    token = CharField()

    class Meta:
        model = CustomUser

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = None

    def validate_token(self, value):
        try:
            self.user = self.Meta.model.objects.get(activation_token=value)
        except ObjectDoesNotExist:
            raise ValidationError('Invalid activation token')
        return value

    def save(self):
        self.user.is_active = True
        self.user.save()
        self.user.activation_token = None  # Clear the token after activation
        self.user.save()
        return self.user


class UserPasswordResetSerializer(Serializer):
    class Meta:
        model = CustomUser


class CustomUserRegisterSerializer(ModelSerializer, V2Serializer):
    password = CharField(write_only=True)
    password_confirm = CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'password_confirm', 'recaptcha')

    def create(self, validated_data):
        validated_data.pop('recaptcha')
        validated_data.pop('password_confirm')
        user = CustomUser.objects.create_user(**validated_data)
        user.generate_activation_token()
        self.send_activation_email(user)
        return user

    def send_activation_email(self, user):
        activation_link = self.context['request'].build_absolute_uri(
            reverse('activate-user', kwargs={'token': user.activation_token})
        )
        with EmailSender() as email_sender:
            email_sender.send_email(
                recipient=user.email,
                subject='Activate your account',
                message_content=f'Click the following link to activate your account: {activation_link}'
            )

    def validate(self, attrs):
        password = attrs.get('password')
        password_confirm = attrs.get('password_confirm')

        if password != password_confirm:
            raise ValidationError("Passwords do not match")
        validate_password(password)
        return attrs


class CustomUserLoginSerializer(V2Serializer):
    email = EmailField(write_only=True)
    password = CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('email', 'password', 'recaptcha')

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        if email and password:
            user = authenticate(request=self.context.get('request'), username=email, password=password)
            if not user:
                raise ValidationError("Invalid login credentials. Please try again.")
            data['user'] = user
        else:
            raise ValidationError("Both email and password are required for login.")

        return data
