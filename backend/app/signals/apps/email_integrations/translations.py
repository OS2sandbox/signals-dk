from enum import Enum

class TranslationKey(Enum):
    email_title_prefix = 'Uw melding'
    email_body_prefix = 'Bedankt voor uw melding'
    email_template_body_help_text = 'Het is mogelijk om Markdown en template variabelen te gebruiken'
    email_acknowledgment_message = 'Bedankt voor uw melding'
    email_assignment_message_template = 'Melding {{ formatted_signal_id }} is toegewezen aan '
    email_feedback_received_thank_you_message = 'Bedankt voor uw feedback'
    email_automated_email_feedback_received_sent = 'Automatische e-mail bij ontvangen van feedback is verzonden aan de melder.'
    email_formatted_signal_reaction_message = 'Melding {formatted_signal_id}: reactie ontvangen'
    email_automated_email_confirmation_message = 'Automatische e-mail bij registratie van de melding is verzonden aan de melder.'
    email_signal_processing_request_format = 'Verzoek tot behandeling van Signalen melding {formatted_signal_id}'
    email_automated_email_notification = 'Automatische e-mail bij doorzetten is verzonden aan externe partij.'
    email_negative_contact_notification_message = 'Meer over uw melding {formatted_signal_id}'
    email_automated_email_on_negative_feedback_resolution = 'Automatische e-mail bij afhandelen heropenen negatieve feedback'
    email_handled_notification_signal_details = 'Meer over uw melding {formatted_signal_id}'
    email_sent_on_resolution = 'Automatische e-mail bij afhandelen is verzonden aan de melder.'
    email_changed_notification_message_template = 'Meer over uw melding {formatted_signal_id}'
    email_statusupdate_notification_message = 'De statusupdate is per e-mail verzonden aan de melder'
    email_automated_email_notification_sent = 'Automatische e-mail bij Reactie ontvangen is verzonden aan de melder.'
    email_query_sent_message = 'E-mail met vraag verstuurd aan melder'
    email_reopened_signal_message = 'Automatische e-mail bij heropenen is verzonden aan de melder.'
    email_scheduled_notification_message = 'Automatische e-mail bij inplannen is verzonden aan de melder.'

translations = {
    'en': {
        TranslationKey.email_title_prefix.value: 'Your message',
        TranslationKey.email_body_prefix.value: 'Thank you for your message!',
        TranslationKey.email_template_body_help_text.value: 'It is possible to use Markdown and template variables',
        TranslationKey.email_acknowledgment_message.value: 'Thank you for your message',
        TranslationKey.email_assignment_message_template.value: "Signal {{ formatted_signal_id }} is assigned to ",
        TranslationKey.email_feedback_received_thank_you_message.value: 'Thank you for your feedback',
        TranslationKey.email_automated_email_feedback_received_sent.value: 'Automated email feedback received sent to the reporter.',
        TranslationKey.email_formatted_signal_reaction_message.value: 'Signal {formatted_signal_id}: reaction received',
        TranslationKey.email_automated_email_confirmation_message.value: 'Automated email confirmation message sent to the reporter.',
        TranslationKey.email_signal_processing_request_format.value: 'Signal processing request for Signal {formatted_signal_id}',
        TranslationKey.email_automated_email_notification.value: 'Automated email notification sent to external party',
        TranslationKey.email_negative_contact_notification_message.value: 'More about your signal {formatted_signal_id}',
        TranslationKey.email_automated_email_on_negative_feedback_resolution.value: 'Automated email on negative feedback resolution',
        TranslationKey.email_handled_notification_signal_details.value: 'More about your signal {formatted_signal_id}',
        TranslationKey.email_sent_on_resolution.value: 'Automated email on resolution sent to the reporter.',
        TranslationKey.email_changed_notification_message_template.value: 'More about your signal {formatted_signal_id}',
        TranslationKey.email_statusupdate_notification_message.value: 'The status update has been sent by email to the reporter',
        TranslationKey.email_automated_email_notification_sent.value: 'Automated email on Reaction received sent to the reporter.',
        TranslationKey.email_query_sent_message.value: 'Email with question sent to reporter',
        TranslationKey.email_reopened_signal_message.value: 'Automated email on reopening sent to the reporter',
        TranslationKey.email_scheduled_notification_message.value: 'Automated email on scheduling sent to the reporter.'
    },
    'da': {
        TranslationKey.email_title_prefix.value: 'Din besked',
        TranslationKey.email_body_prefix.value: 'Tak for din besked!',
        TranslationKey.email_template_body_help_text.value: 'Det er muligt at bruge Markdown og skabelonvariabler',
        TranslationKey.email_acknowledgment_message.value: 'Tak for din besked',
        TranslationKey.email_assignment_message_template.value: "Signal {{ formatted_signal_id }} er tildelt ",
        TranslationKey.email_feedback_received_thank_you_message.value: 'Tak for din feedback',
        TranslationKey.email_automated_email_feedback_received_sent.value: 'Automatisk modtaget e-mail feedback sendt til rapportøren.',
        TranslationKey.email_formatted_signal_reaction_message.value: 'Signal {formatted_signal_id}: reaktion modtaget',
        TranslationKey.email_automated_email_confirmation_message.value: 'Automatisk bekræftelses e-mail sendt til rapportøren.',
        TranslationKey.email_signal_processing_request_format.value: 'Behandlingsanmodning for signal {formatted_signal_id}',
        TranslationKey.email_automated_email_notification.value: 'Automatisk e-mail sendt til ekstern part',
        TranslationKey.email_negative_contact_notification_message.value: 'Mere om dit signal {formatted_signal_id}',
        TranslationKey.email_automated_email_on_negative_feedback_resolution.value: 'Automatisk e-mail omkring løsning af negativ feedback',
        TranslationKey.email_handled_notification_signal_details.value: 'Mere om dit signal {formatted_signal_id}',
        TranslationKey.email_sent_on_resolution.value: 'Automatisk e-mail om løsning sendt til rapportøren.',
        TranslationKey.email_changed_notification_message_template.value: 'Mere om dit signal {formatted_signal_id}',
        TranslationKey.email_statusupdate_notification_message.value: 'Statusopdateringen er sendt via e-mail til rapportøren',
        TranslationKey.email_automated_email_notification_sent.value: 'Automatisk e-mail om modtaget reaktion sendt til rapportøren',
        TranslationKey.email_query_sent_message.value: 'E-mail med spørgsmål sendt til rapportøren',
        TranslationKey.email_reopened_signal_message.value: 'Automatisk e-mail om genåbning sendt til rapportøren',
        TranslationKey.email_scheduled_notification_message.value: 'Automatisk e-mail om planlægning sendt til rapportøren'
    }
}

def translate(key: TranslationKey, lang='da'):
    return translations.get(lang, {}).get(key.value, key.value)
