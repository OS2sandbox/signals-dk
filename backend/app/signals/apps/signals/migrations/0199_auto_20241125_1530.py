# SPDX-License-Identifier: MPL-2.0
# Copyright (C) 2023 Gemeente Amsterdam

import os
import csv

from django.db import migrations
from django.conf import settings

def translate_category_names_to_danish(apps, schema_editor):
    translations = {}
    
    csv_path = os.path.join(settings.BASE_DIR, 'apps/signals/migrations/', '0199_da.csv')
    with open(csv_path, mode='r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile, delimiter=';')
        for row in reader:
            slug = row['slug']
            translations[slug] = {
                'name': row['name'],
                'handling_message': row['handling_message']
            }
    
    Category = apps.get_model('signals', 'Category')
    for (slug, values) in translations.items():
        try:
            # Update name and handling_message if the category exists
            category = Category.objects.filter(slug=slug).first()
            if category:
                category.name = values['name']
                category.handling_message = values['handling_message']
                category.save()
                print(f"Updated category '{category.name}' to '{values['name']}'")
            else:
                print(f"Category with slug '{slug}' does not exist. Skipping update.")
        except Exception as e:
            print(f"Error processing category '{slug}': {e}")

class Migration(migrations.Migration):

    dependencies = [
        ('signals', '0198_auto_20241125_1429'),
    ]

    operations = [
        migrations.RunPython(translate_category_names_to_danish),
    ]
