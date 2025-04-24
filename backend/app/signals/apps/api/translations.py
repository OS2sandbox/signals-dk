from enum import Enum

class TranslationKey(Enum):
    api_attachment_note = 'Bijlage toegevoegd'
    api_attachment_note_2 = 'Bijlage toegevoegd door melder'
    api_bijlage = 'Bijlage'
    api_attachment_deleted_message = 'is verwijderd.'

translations = {
    'en': {
        TranslationKey.api_attachment_note.value: 'Attachment added',
        TranslationKey.api_attachment_note_2.value: 'Attachment added by reporter',
        TranslationKey.api_bijlage.value: 'Attachment',
        TranslationKey.api_attachment_deleted_message.value: 'is deleted.'
    },
    'da': {
        TranslationKey.api_attachment_note.value: 'Bilag tilføjet',
        TranslationKey.api_attachment_note_2.value: 'Bilag tilføjet af rapportør',
        TranslationKey.api_bijlage.value: 'Bilag',
        TranslationKey.api_attachment_deleted_message.value: 'er slettet.'
    }
}

def translate(key: TranslationKey, lang='da'):
    return translations.get(lang, {}).get(key.value, key.value)
