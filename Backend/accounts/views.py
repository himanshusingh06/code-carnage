from django.contrib.auth import get_user_model
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.core.mail import send_mail
from django.conf import settings
from .serializers import UserRegisterSerializer, VerifyEmailSerializer,CustomTokenObtainPairSerializer
from rest_framework.exceptions import ValidationError

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer

    def perform_create(self, validated_data):
        try:
            user = User.objects.create_user(**validated_data)
            user.set_password(validated_data["password"])  
            user.generate_verification_code()  
            user.save()

            send_mail(
                "Your Verification Code",
                f"Your verification code is: {user.verification_code}",
                settings.EMAIL_HOST_USER,
                [user.email],
                fail_silently=False,
            )
            return user

        except Exception as e:
            raise Exception(f"Error creating user or sending email: {str(e)}")
    
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            user = self.perform_create(serializer.validated_data)
            return Response(
                {"message": "Account registered successfully", 
                 "data": {
                        "first_name":user.first_name,
                        "last_name":user.last_name,
                        "username":user.username,
                        "email": user.email,
                        "account_type": user.account_type
                          }
                 },status=status.HTTP_201_CREATED)
            
        except ValidationError as e:
            return Response(
                {
                    "message": "User registration failed",
                    "error": e.detail
                 },status=status.HTTP_400_BAD_REQUEST
            )

class VerifyEmailView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = VerifyEmailSerializer

    def update(self, request, *args, **kwargs):
        data = request.data
        print(data,"-------------->")
        user = User.objects.get(email=data["email"],id=data["user_id"])
        print("user:",user)
        try:
            if user.verification_code == data["verification_code"]:
                user.email_verified = True
                user.verification_code = None  
                user.save()
                return Response(
                    {"message": "Email verified successfully"}, 
                    status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"message": "Verification failed", 
                     "error": "Invalid verification code"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        except User.DoesNotExist:
            return Response(
                {"message": "Verification failed", 
                 "error": "User not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"message": "Verification failed", "error": str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )


class LogoutView(generics.GenericAPIView):
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"message": "Logout successful", "data": {}}, 
                status=status.HTTP_200_OK
            )
        except Exception:
            return Response(
                {"message": "Logout failed", "error": "Invalid token"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
