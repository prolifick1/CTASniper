from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.homepage),
    path('signup', views.sign_up),
    path('login', views.log_in),
    path('logout', views.log_in),
    path('whoami', views.who_am_i)
]

