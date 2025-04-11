from rest_framework import serializers
from .models import Clinic, Doctor, Patient, Appointment, Prescription
class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = ['id', 'doctor', 'clinic', 'name', 'specialization', 'experience', 'availability', 'available_days', 'created_at']
        read_only_fields = ['id', 'created_at']

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
    appointment = AppointmentSerializer(read_only=True)
    doctor = DoctorSerializer(read_only=True)
    patient = PatientSerializer(read_only=True)

    appointment_id = serializers.PrimaryKeyRelatedField(queryset=Appointment.objects.all(), source='appointment', write_only=True)
    doctor_id = serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.all(), source='doctor', write_only=True)
    patient_id = serializers.PrimaryKeyRelatedField(queryset=Patient.objects.all(), source='patient', write_only=True)

    class Meta:
        model = Prescription
        fields = [
            'id', 'appointment', 'appointment_id',
            'doctor', 'doctor_id',
            'patient', 'patient_id',
            'symptoms', 'diagnosis', 'tests',
            'medications', 'instructions', 'issued_at'
        ]