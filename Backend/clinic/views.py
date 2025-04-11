from rest_framework import generics
from .models import Clinic
from .serializers import ClinicSerializer

# Create a new clinic
class ClinicAPIView(generics.CreateAPIView):
    queryset = Clinic.objects.all()
    serializer_class = ClinicSerializer


from .models import Doctor
from .serializers import DoctorSerializer


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