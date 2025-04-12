from django.contrib import admin
from .models import Clinic, Doctor, Patient, Appointment, Prescription


@admin.register(Clinic)
class ClinicAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'address', 'created_at')
    search_fields = ('name', 'address')


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'specialization', 'clinic', 'experience')
    search_fields = ('name', 'specialization')
    list_filter = ('clinic',)


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'age', 'gender', 'phone')
    search_fields = ('patient__username', 'phone')


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'doctor', 'clinic', 'appointment_date', 'is_completed')
    search_fields = ('patient__patient__username', 'doctor__name')
    list_filter = ('clinic', 'doctor', 'is_completed')


@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'doctor', 'appointment', 'issued_at')
    search_fields = ('patient__patient__username', 'doctor__name')