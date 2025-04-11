from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Clinic,Doctor
from .serializers import ClinicSerializer,DoctorSerializer
from rest_framework.response import Response
from rest_framework import status
from accounts.models import Accounts

# Create a new clinic
class ClinicAPIView(generics.ListCreateAPIView):
    serializer_class = ClinicSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Clinic.objects.filter(clinic=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        serialized_data = serializer.data
        for item in serialized_data:
            item['account_type'] = request.user.account_type
        return Response({
            "message": "success",
            "data": serializer.data
        }, status=status.HTTP_200_OK)
    def perform_create(self, serializer):
        # Assign the clinic from the currently logged-in user
        serializer.save(clinic=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response({
                "message": "successful",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            "message": "error",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

# List all doctors
class DoctorListAPIView(generics.ListAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer

# Create a new doctor
class DoctorCreateAPIView(generics.CreateAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer


# Delete a doctor by ID
class DoctorDeleteAPIView(generics.DestroyAPIView):
    queryset = Doctor.objects.all()
    serializer_class = DoctorSerializer
    lookup_field = 'id'  # allows deletion via doctor ID