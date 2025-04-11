from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Clinic,Doctor,Appointment
from .serializers import ClinicSerializer,DoctorSerializer,AppointmentSerializer
from rest_framework.response import Response
from rest_framework import status
from accounts.models import Accounts
from rest_framework.exceptions import NotFound,ValidationError
from rest_framework.generics import ListCreateAPIView
from django.db import IntegrityError
from django.shortcuts import get_object_or_404





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

        for idx, item in enumerate(serialized_data):
            item['account_type'] = request.user.account_type

            # Get the actual clinic instance from queryset
            clinic_instance = queryset[idx]

            # Fetch doctors related to this clinic
            doctors = Doctor.objects.filter(clinic=clinic_instance)
            doctor_serializer = DoctorSerializer(doctors, many=True)
            item['doctors'] = doctor_serializer.data

        return Response({
            "message": "success",
            "data": serialized_data
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


class DoctorListCreateView(ListCreateAPIView):
    serializer_class = DoctorSerializer

    def get_queryset(self):
        queryset = Doctor.objects.all()
        if not queryset.exists():
            from rest_framework.exceptions import NotFound
            raise NotFound(detail="No doctors found.")
        return queryset

    def perform_create(self, serializer):
        try:
            serializer.save()
        except IntegrityError as e:
            raise ValidationError({"message": "Integrity Error", "error": str(e)})

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({
            "message": "successful",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)






class AppointmentListCreateView(generics.ListCreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        # Ensure clinic exists for logged-in user
        clinic = get_object_or_404(Clinic, clinic=user)
        
        doc_id = self.request.query_params.get('doc_id', None)

        if doc_id:
            return Appointment.objects.filter(clinic=clinic, doctor__id=doc_id)
        return Appointment.objects.filter(clinic=clinic)

    def perform_create(self, serializer):
        try:
            serializer.save()
        except Exception as e:
            raise serializers.ValidationError({"message": "Failed to create appointment", "error": str(e)})

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response({
            "message": "successful",
            "data": serializer.data
        }, status=status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "message": "successful",
            "data": serializer.data
        }, status=status.HTTP_200_OK)
