from django.db import models
from django.db import models
from django.utils import timezone
from accounts.models import Accounts



class Clinic(models.Model):
    clinic = models.OneToOneField(Accounts, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    address = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Doctor(models.Model):
    doctor = models.OneToOneField(Accounts, on_delete=models.CASCADE)
    clinic = models.ForeignKey(Clinic, related_name='doctors', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    specialization = models.CharField(max_length=255)
    experience = models.PositiveIntegerField(help_text="Years of experience")
    available_days = models.CharField(max_length=100, help_text="e.g. Mon-Fri")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.specialization}"








class Patient(models.Model):
    patient = models.OneToOneField(Accounts, on_delete=models.CASCADE)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    address = models.TextField()
    phone = models.CharField(max_length=20)

    def __str__(self):
        return f"Patient: {self.user.username}"


class Appointment(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointments')
    clinic = models.ForeignKey(Clinic, on_delete=models.CASCADE, related_name='appointments')
    appointment_date = models.DateTimeField()
    reason = models.TextField(blank=True)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Appointment {self.id} - {self.patient.user.username} with {self.doctor.name}"


class Prescription(models.Model):
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, related_name='prescription')
    doctor = models.ForeignKey('Doctor', on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    symptoms = models.TextField()
    diagnosis = models.TextField()
    tests = models.TextField()
    medications = models.TextField(help_text="List of medications prescribed")
    instructions = models.TextField(blank=True)
    issued_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Prescription {self.id} - {self.patient.user.username}"
