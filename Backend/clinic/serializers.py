from rest_framework import serializers
from .models import Clinic, Doctor, Patient, Appointment, Prescription
from django.utils import timezone
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
    patient = serializers.PrimaryKeyRelatedField(queryset=Patient.objects.all())
    doctor = serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.all())

    # Nested read-only serializers for response
    patient_details = PatientSerializer(source='patient', read_only=True)
    doctor_details = DoctorSerializer(source='doctor', read_only=True)
    clinic_details = ClinicSerializer(source='clinic', read_only=True)

    class Meta:
        model = Appointment
        fields = [
            'id',
            'patient', 'doctor', 'clinic',  # for writing
            'patient_details', 'doctor_details', 'clinic_details',  # for reading
            'appointment_date',
            'reason',
            'is_completed',
            'created_at',
        ]
        read_only_fields = ['clinic', 'created_at']
    
    def validate(self, data):
        if data.get('appointment_date') and data['appointment_date'] < timezone.now():
            raise serializers.ValidationError({
                "appointment_date": "Appointment date cannot be in the past."
            })
        return data





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

