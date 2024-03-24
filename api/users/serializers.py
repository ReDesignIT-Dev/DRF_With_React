from rest_framework import serializers
from rest_registration.api.serializers import DefaultRegisterUserSerializer
from .models import CustomUser
from django.contrib.auth import authenticate
from rest_framework_recaptcha.fields import ReCaptchaField

class CustomUserSerializer(DefaultRegisterUserSerializer):
    recaptcha = ReCaptchaField()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'password', 'email_confirmed', 'first_name', 'last_name')
        extra_kwargs = {
            'id': {'read_only': True},
            'email_confirmed': {'read_only': True},
            'first_name': {'required': False},
            'last_name': {'required': False},
        }

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user


class CustomLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'), username=email, password=password)

            if not user:
                raise serializers.ValidationError("Invalid login credentials. Please try again.")

            data['user'] = user
        else:
            raise serializers.ValidationError("Both email and password are required for login.")

        return data
