# SPDX-License-Identifier: MPL-2.0
# Copyright (C) 2023 Gemeente Amsterdam

from django.contrib.auth.models import Permission
from django.db.models.signals import post_migrate
from django.db import migrations

def translate_permission_names_to_danish(apps, schema_editor):
    translations = {
        ("sia_can_view_contact_details", "Inzien van contactgegevens melder (in melding)"): "Se kontaktoplysninger for rapportør (i meddelelse)",
        ("sia_read", "Leesrechten algemeen"): "Læs tilladelser generelt",
        ("sia_write", "Schrijfrechten algemeen"): "Skriv tilladelser generelt",
        ("sia_split", "Splitsen van een melding"): "Opdele en meddelelse",
        ("sia_signal_create_initial", "Melding aanmaken"): "Oprette en meddelelse",
        ("sia_signal_create_note", "Notitie toevoegen bij een melding"): "Tilføje en note til en meddelelse",
        ("sia_signal_change_status", "Wijzigen van status van een melding"): "Ændre status for en meddelelse",
        ("sia_signal_change_category", "Wijzigen van categorie van een melding"): "Ændre kategori for en meddelelse",
        ("sia_signal_export", "Meldingen exporteren"): "Eksportere meddelelser",
        ("sia_signal_report", "Rapportage beheren"): "Administrere rapportering",
        ("sia_department_read", "Inzien van afdeling instellingen"): "Se afdelingsindstillinger",
        ("sia_department_write", "Wijzigen van afdeling instellingen"): "Ændre afdelingsindstillinger",
        ("sia_add_attachment", "Kan bijlage bij een melding toevoegen."): "Kan vedhæfte en meddelelse.",
        ("sia_change_attachment", "Kan gegevens van een bijlage bewerken."): "Kan redigere oplysninger om en vedhæftning.",
        ("sia_delete_attachment_of_normal_signal", "Kan bijlage bij standaard melding verwijderen."): "Kan vedhæftning til standardmeddelelse slettes.",
        ("sia_delete_attachment_of_parent_signal", "Kan bijlage bij hoofdmelding verwijderen."): "Kan vedhæftning til hovedmeddelelse slettes.",
        ("sia_delete_attachment_of_child_signal", "Kan bijlage bij deelmelding verwijderen."): "Kan vedhæftning til delmeddelelse slettes.",
        ("sia_delete_attachment_of_other_user", "Kan bijlage bij melding van andere gebruiker verwijderen."): "Kan vedhæftning til meddelelse fra en anden bruger slettes.",
        ("sia_delete_attachment_of_anonymous_user", "Kan bijlage toegevoegd door melder verwijderen."): "Kan vedhæftning tilføjet af rapportør slettes.",
        ("sia_can_view_all_categories", "Bekijk all categorieën (overschrijft categorie rechten van afdeling)"): "Se alle kategorier (overskriver kategorirettigheder for afdeling)",
        ("sia_category_read", "Inzien van categorieën"): "Se kategorier",
        ("sia_category_write", "Wijzigen van categorieën"): "Ændre kategorier",
        ("sia_statusmessagetemplate_write", "Wijzingen van standaardteksten"): "Ændringer i standardtekster",
        ("sia_expression_read", "Inzien van expressies"): "Se udtryk",
        ("sia_expression_write", "Wijzigen van expressies"): "Ændre udtryk",
        ("sia_statusmessagecategory_write", "Wijzingen van standaardteksten"): "Ændringer i standardtekster",
        ("sia_statusmessage_write", "Toewijzen van standaardteksten aan categorieën"): "Tildeling af standardtekster til kategorier"
    }

    for (codename, name), new_name in translations.items():
        try:
            permission = Permission.objects.filter(codename=codename).first()
            if permission:
                # Update name if the permission exists
                if permission.name != new_name:
                    permission.name = new_name
                    permission.save()
                    print(f"Updated permission '{name}' to '{new_name}'")
            else:
                print(f"Permission with codename '{codename}' does not exist. Skipping update.")
        except Exception as e:
            print(f"Error processing permission '{codename}': {e}")

class Migration(migrations.Migration):

    dependencies = [
        ('signals', '0197_auto_20231030_1323'), 
    ]

    operations = [
        migrations.RunPython(translate_permission_names_to_danish),
    ]