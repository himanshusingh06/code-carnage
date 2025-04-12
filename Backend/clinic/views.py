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
from rest_framework.decorators import api_view, permission_classes
from langchain_google_genai import ChatGoogleGenerativeAI
import markdown2
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
        user = self.request.user

        if not user.is_authenticated:
            raise ValidationError({"message": "Authentication required."})

        # If user is a patient
        if hasattr(user, 'patient'):
            return Appointment.objects.filter(patient=user.patient)

        # If user is a doctor
        elif hasattr(user, 'doctor'):
            return Appointment.objects.filter(doctor=user.doctor)

        # If user is a clinic/admin etc., return all (or customize this)
        elif user.is_superuser:
            return Appointment.objects.all()

        else:
            return Appointment.objects.none()

    def perform_create(self, serializer):
        user = self.request.user

        try:
            # Example logic: the current user is the patient
            patient = Patient.objects.get(patient=user)
            doctor_id = self.request.data.get("doctor")
            doctor = Doctor.objects.get(id=doctor_id)
            clinic = doctor.clinic  # assuming appointment is at the doctor’s clinic

            serializer.save(patient=patient, doctor=doctor, clinic=clinic)

        except Patient.DoesNotExist:
            raise ValidationError({"message": "Patient profile not found."})
        except Doctor.DoesNotExist:
            raise ValidationError({"message": "Doctor not found."})
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
        return Appointment.objects.select_related('patient', 'doctor', 'clinic').all()

    def perform_create(self, serializer):
        try:
            # Assuming request.user is a clinic or linked to one
            clinic = getattr(self.request.user, 'clinic', None)
            if clinic is None:
                raise Exception("Clinic not found for this user.")

            appointment = serializer.save(clinic=clinic)
            self.custom_response = Response({
                "message": "successful",
                "data": AppointmentSerializer(appointment).data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            self.custom_response = Response({
                "message": "error",
                "error": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return self.custom_response

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






GOOGLE_API_KEY = 'AIzaSyDkS1WQkQaqgUOA-NoY2YbRbEX4c16_Ads'  # Replace with your real key
llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash", google_api_key=GOOGLE_API_KEY)

def to_markdown(text):
    """Convert markdown-style text to HTML."""
    text = text.replace('•', '*')  # Normalize bullet points
    return markdown2.markdown(text)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_side_effects(request):
    medicine_name = request.GET.get('medicine')

    if not medicine_name:
        return Response({'error': 'Medicine name is required.'}, status=400)

    prompt = (
        f"List the top 3 adverse side effects of the medicine '{medicine_name}' , Just list down the side effects no need to return any other thing "
        f"respond in just 10-15 words "

    )

    try:
        result = llm.invoke(prompt)
        response_text = to_markdown(result.content)
        return Response({'medicine': medicine_name, 'side_effects': response_text})
    except Exception as e:
        return Response({'error': f"AI response failed: {str(e)}"}, status=500)