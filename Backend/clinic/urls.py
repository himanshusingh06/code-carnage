from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.ClinicAPIView.as_view(), name="clinic-listcreate"),
    path('get-doctors/', views.DoctorListAPIView.as_view(), name='doctor-list'),
    path('doctors/create', views.DoctorCreateAPIView.as_view(), name='doctor-create'),
    path('doctors/delete/<int:id>/', views.DoctorDeleteAPIView.as_view(), name='doctor-delete'),
]