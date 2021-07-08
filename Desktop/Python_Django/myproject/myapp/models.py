from django.db import models

# Create your models here.
# Model : use database without sql
# data is used as an object
# model = table
# field of model = column of table
# instance = record of table
# value of field = value in the table

class Bookmark(models.Model):
    site_name = models.CharField(max_length=100)
    url = models.URLField('Site URL')

    # What fields decide
    # 1. Sort of colunm of database
    # 2. Restrictions (number of words)
    # 3. Sort of form
    # 4. Restrictions of form

# Model made -> what type of data will be into database
# migration -> model is informed in database(create table)
# makemigrations -> record of change of model