from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Clinic,Doctor,Appointment,Prescription
from .serializers import ClinicSerializer,DoctorSerializer,AppointmentSerializer,PrescriptionSerializer
from rest_framework.response import Response
from rest_framework import status
from accounts.models import Accounts
from rest_framework.exceptions import NotFound,ValidationError
from rest_framework.generics import ListCreateAPIView
from django.db import IntegrityError
from django.shortcuts import get_object_or_404
from django.utils import timezone

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
            raise NotFound(detail="No doctors found.")
        return queryset

    def perform_create(self, serializer):
        try:
            user = self.request.user  # assuming request.user is the related Accounts object
            clinic = Clinic.objects.get(clinic=user)  # getting clinic related to this account

            serializer.save(doctor=user, clinic=clinic)

        except Clinic.DoesNotExist:
            raise ValidationError({"message": "Clinic not found for this account."})

        except IntegrityError as e:
            raise ValidationError({"message": "Integrity Error", "error": str(e)})

        except ValidationError as e:
            raise ValidationError({"message": "Validation Error", "error": str(e)})

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
        # if date:
        #     return Appointment.objects.filter(clinic=clinic, doctor__id=doc_id)
        # return Appointment.objects.filter(clinic=clinic)

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



# views.py


class PrescriptionCreateListView(generics.ListCreateAPIView):
    serializer_class = PrescriptionSerializer

    def get_queryset(self):
        user = self.request.user
        return Prescription.objects.filter(appointment__clinic__clinic=user)

    def perform_create(self, serializer):
        appointment = serializer.validated_data['appointment']
        doctor = appointment.doctor
        patient = appointment.patient

        prescription = serializer.save(doctor=doctor, patient=patient)

        # Mark appointment as completed
        appointment.is_completed = True
        appointment.save()

        # If follow-up is set to True, create a new appointment
        if prescription.followup and prescription.followup_date:
            Appointment.objects.create(
                patient=patient,
                doctor=doctor,
                clinic=appointment.clinic,
                appointment_date=prescription.followup_date,
                reason="Follow-up appointment",
                is_completed=False
            )

        return prescription

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            prescription = self.perform_create(serializer)
            return Response({
                "message": "Prescription created successfully",
                "data": self.get_serializer(prescription).data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({
                "message": "Failed to create prescription",
                "error": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
