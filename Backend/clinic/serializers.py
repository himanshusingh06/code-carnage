from rest_framework import serializers
from .models import Clinic, Doctor, Patient, Appointment, Prescription
class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['id', 'doctor', 'clinic', 'name', 'specialization', 'experience', 'availability', 'available_days', 'created_at']
        read_only_fields = ['id', 'created_at','doctor','clinic']

class ClinicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clinic
        fields = ['id', 'clinic', 'name', 'description', 'address', 'created_at']
        read_only_fields = ['id', 'clinic', 'created_at']

    def validate(self, attrs):
        # Add field validation if needed (optional)
        return attrs





class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ['id', 'patient', 'age', 'gender', 'address', 'phone']



class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['id', 'patient', 'doctor', 'clinic', 'appointment_date', 'reason', 'is_completed', 'created_at']
        read_only_fields = ['id', 'created_at']



class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = [
            'id',
            'appointment',
            'doctor',
            'patient',
            'symptoms',
            'diagnosis',
            'tests',
            'medications',
            'instructions',
            'followup',
            'followup_date',
            'issued_at',
        ]
        read_only_fields = ['id', 'issued_at', 'doctor', 'patient','appointment']

