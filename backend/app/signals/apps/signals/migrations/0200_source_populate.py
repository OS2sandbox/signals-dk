from django.db import migrations

def add_signals_source_entries(apps, schema_editor):
    SignalsSource = apps.get_model('signals', 'Source')
    entries = [
        {
            "name": "Online",
            "description": "Online",
            "order": 1,
            "is_active": True,
            "is_public": True,
            "can_be_selected": False,
        },
        {
            "name": "Telefon",
            "description": "Telefon",
            "order": 1,
            "is_active": True,
            "is_public": False,
            "can_be_selected": True,
        },
        {
            "name": "Intern indberetning",
            "description": "Intern indberetning",
            "order": 1,
            "is_active": True,
            "is_public": False,
            "can_be_selected": True,
        },
        {
            "name": "E-mail",
            "description": "E-mail",
            "order": 2,
            "is_active": True,
            "is_public": False,
            "can_be_selected": True,
        },
        {
            "name": "Chat",
            "description": "Chat",
            "order": 2,
            "is_active": True,
            "is_public": False,
            "can_be_selected": True,
        },
        {
            "name": "Facebook",
            "description": "Facebook",
            "order": 2,
            "is_active": True,
            "is_public": False,
            "can_be_selected": True,
        },
        {
            "name": "Instagram",
            "description": "Instagram",
            "order": 2,
            "is_active": True,
            "is_public": False,
            "can_be_selected": True,
        },
        {
            "name": "X",
            "description": "X",
            "order": 2,
            "is_active": True,
            "is_public": False,
            "can_be_selected": True,
        },
        {
            "name": "Andet",
            "description": "Andet",
            "order": 2,
            "is_active": True,
            "is_public": False,
            "can_be_selected": True,
        },
    ]
    for entry in entries:
        SignalsSource.objects.create(**entry)

class Migration(migrations.Migration):

    dependencies = [
        ('signals', '0199_auto_20241125_1530'),
    ]

    operations = [
        migrations.RunPython(add_signals_source_entries),
    ]
