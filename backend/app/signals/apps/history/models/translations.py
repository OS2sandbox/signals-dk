from enum import Enum

class TranslationKey(Enum):
    log_unknown_action = 'Actie onbekend.'
    log_unknown = 'Onbekend'
    log_status_choice = 'Status gewijzigd naar'
    log_priority_high = 'Hoog'
    log_priority_normal = 'Normaal'
    log_priority_low = 'Laag'
    log_urgency_changed_to = 'Urgentie gewijzigd naar'
    log_category_changed_to = 'Categorie gewijzigd naar'
    log_location_changed_to = 'Locatie gewijzigd naar'
    log_note_added = 'Notitie toegevoegd'
    log_feedback_from_reporter = 'Feedback van melder'
    log_type_changed_to = 'Type gewijzigd naar'
    log_direction_changed_to = 'Verantwoordelijke afdeling gewijzigd naar'
    log_responsible_department = "Verantwoordelijke afdeling"
    log_default_responsible_department = 'Verantwoordelijke afdeling (routering)'
    log_routing_department_changed_to = 'Routering: afdeling/afdelingen gewijzigd naar'
    log_report_assignment_changed_to = 'Melding toewijzing gewijzigd naar'
    log_unassigned_report = 'Melding niet meer toegewezen aan behandelaar.'
    log_sub_report_added = 'Deelmelding toegevoegd'
    log_service_commitment = 'Servicebelofte'
    log_received_explanation = 'Toelichting ontvangen'
    log_no_explanation_received = 'Geen toelichting ontvangen'
    log_reporter_contact_info = 'Contactgegevens melder'
    log_default_service_promise = 'Servicebelofte onbekend'

translations = {
    'en': {
        TranslationKey.log_unknown_action.value: 'Action unknown.',
        TranslationKey.log_unknown.value: 'Unknown',
        TranslationKey.log_status_choice.value: 'Status changed to',
        TranslationKey.log_priority_high.value: 'High',
        TranslationKey.log_priority_normal.value: 'Normal',
        TranslationKey.log_priority_low.value: 'Low',
        TranslationKey.log_urgency_changed_to.value: 'Urgency changed to',
        TranslationKey.log_category_changed_to.value: 'Category changed to',
        TranslationKey.log_location_changed_to.value: 'Location changed to',
        TranslationKey.log_note_added.value: 'Note added',
        TranslationKey.log_feedback_from_reporter.value: 'Feedback from reporter',
        TranslationKey.log_type_changed_to.value: 'Type changed to',
        TranslationKey.log_direction_changed_to.value: 'Responsible department changed to',
        TranslationKey.log_responsible_department.value: 'Responsible department',
        TranslationKey.log_default_responsible_department.value: 'Responsible department (routing)',
        TranslationKey.log_routing_department_changed_to.value: 'Routing: department(s) changed to',
        TranslationKey.log_report_assignment_changed_to.value: 'Report assignment changed to',
        TranslationKey.log_unassigned_report.value: 'Report no longer assigned to handler.',
        TranslationKey.log_sub_report_added.value: 'Sub-report added',
        TranslationKey.log_service_commitment.value: 'Service commitment',
        TranslationKey.log_received_explanation.value: 'Explanation received',
        TranslationKey.log_no_explanation_received.value: 'No explanation received',
        TranslationKey.log_reporter_contact_info.value: 'Reporter contact information',
        TranslationKey.log_default_service_promise.value: 'Service promise unknown'
    },
    'da': {
        TranslationKey.log_unknown_action.value: 'Handling ukendt.',
        TranslationKey.log_unknown.value: 'Ukendt',
        TranslationKey.log_status_choice.value: 'Status ændret til',
        TranslationKey.log_priority_high.value: 'Høj',
        TranslationKey.log_priority_normal.value: 'Normal',
        TranslationKey.log_priority_low.value: 'Lav',
        TranslationKey.log_urgency_changed_to.value: 'Prioritet ændret til',
        TranslationKey.log_category_changed_to.value: 'Kategori ændret til',
        TranslationKey.log_location_changed_to.value: 'Placering ændret til',
        TranslationKey.log_note_added.value: 'Note tilføjet',
        TranslationKey.log_feedback_from_reporter.value: 'Feedback fra rapportør',
        TranslationKey.log_type_changed_to.value: 'Type ændret til',
        TranslationKey.log_direction_changed_to.value: 'Ansvarlig afdeling ændret til',
        TranslationKey.log_responsible_department.value: 'Ansvarlig afdeling',
        TranslationKey.log_default_responsible_department.value: 'Ansvarlig afdeling (routing)',
        TranslationKey.log_routing_department_changed_to.value: 'Routing: afdeling(er) ændret til',
        TranslationKey.log_report_assignment_changed_to.value: 'Rapport tildeling ændret til',
        TranslationKey.log_unassigned_report.value: 'Rapport ikke længere tildelt behandler.',
        TranslationKey.log_sub_report_added.value: 'Underrapport tilføjet',
        TranslationKey.log_service_commitment.value: 'Serviceforpligtelse',
        TranslationKey.log_received_explanation.value: 'Forklaring modtaget',
        TranslationKey.log_no_explanation_received.value: 'Ingen forklaring modtaget',
        TranslationKey.log_reporter_contact_info.value: 'Rapportør kontaktoplysninger',
        TranslationKey.log_default_service_promise.value: 'Serviceløfte ukendt'
    }
}

def translate(key: TranslationKey, lang='da'):
    return translations.get(lang, {}).get(key.value, key.value)