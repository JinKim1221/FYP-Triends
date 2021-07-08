from django.contrib import admin
from django.db import models

# Register your models here.
# Register model I made to manage in admin page 

from .models import Bookmark

admin.site.register(Bookmark)