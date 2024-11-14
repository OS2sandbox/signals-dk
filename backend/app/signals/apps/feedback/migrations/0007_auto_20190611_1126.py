# SPDX-License-Identifier: MPL-2.0
# Copyright (C) 2019 - 2021 Gemeente Amsterdam
# Generated by Django 2.1.9 on 2019-06-11 09:26

from django.db import migrations

SHOULD_REQUEST_REOPEN = (
    # Unhappy reporters
    'De oplossing volstaat niet, mijn melding is niet opgelost',
    'Ik heb onvoldoende / onjuiste informatie gekregen',
    'Er is niets met mijn melding gedaan',
    'Ik voel mij niet serieus genomen door de gemeente',
)


def set_defaults_for_reopen_requested(apps, schema_editor):
    """Turn on automatic request to reopen for specific standard awnsers."""
    StandardAnswer = apps.get_model('feedback', 'StandardAnswer')

    for text in SHOULD_REQUEST_REOPEN:
        try:
            sa = StandardAnswer.objects.get(text=text)
        except StandardAnswer.DoesNotExist:
            pass  # question no longer in configuration
        else:
            sa.reopens_when_unhappy = True
            sa.save()


class Migration(migrations.Migration):

    dependencies = [
        ('feedback', '0006_auto_20190611_1125'),
    ]

    operations = [
        migrations.RunPython(set_defaults_for_reopen_requested),
    ]