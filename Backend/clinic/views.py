from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Clinic,Doctor
from .serializers import ClinicSerializer,DoctorSerializer

# Create a new clinic
class ClinicAPIView(generics.ListCreateAPIView):
    # queryset = Clinic.objects.all()
    permission_classes=[IsAuthenticated]
    serializer_class = ClinicSerializer
    def get_queryset(self):
        print(self.request)
        clinic= Clinic.objects.filter(clinic=self.request.user)
        return clinic



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