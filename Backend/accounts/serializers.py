from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["first_name","last_name","account_type","username", "email", "password"]


class VerifyEmailSerializer(serializers.Serializer):
    user_id = serializers.CharField(max_length=32)
    email = serializers.EmailField()
    verification_code = serializers.CharField(max_length=6)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        data['user_id'] = self.user.id
        data['email'] = self.user.email
        data['email_verified'] = self.user.email_verified
        data['account_type'] = self.user.account_type

        return data