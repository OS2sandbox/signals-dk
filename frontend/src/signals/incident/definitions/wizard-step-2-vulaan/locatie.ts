//import i18n from 'i18n'
import i18n from 'i18n'
import { QuestionFieldType } from 'types/question'

const locatie = {
  meta: {
    featureTypes: [],
    label: i18n.t('waar-is-het'),
    language: {
      title: i18n.t('selecteer-de-locatie'),
      subTitle: i18n.t('waar-is-het'),
      description: i18n.t('typ-het-dichtstbijzijnde-adres-klik-de-locatie-aan'),
      submit: i18n.t('bevestigen'),
    },
    shortLabel: i18n.t('waar-is-het'),
  },
  render: QuestionFieldType.LocationSelect,
  options: {
    validators: ['required'],
  },
}

export default locatie
