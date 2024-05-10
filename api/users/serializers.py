from rest_framework.serializers import Serializer, ModelSerializer, CharField, ValidationError
from .models import CustomUser
from django.contrib.auth import authenticate
from drf_recaptcha.fields import ReCaptchaV2Field
from django.contrib.auth.password_validation import validate_password


class V2Serializer(Serializer):
    recaptcha = ReCaptchaV2Field()


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
        return user

    def validate(self, attrs):
        password = attrs.get('password')
        password_confirm = attrs.get('password_confirm')

        if password != password_confirm:
            raise ValidationError("Passwords do not match")
        validate_password(password)
        return attrs


class CustomUserLoginSerializer(ModelSerializer, V2Serializer):
    class Meta:
        model = CustomUser
        fields = ('email', 'password', 'recaptcha')
        extra_kwargs = {
            'recaptcha': {'required': True},
        }

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
