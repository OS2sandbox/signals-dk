// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import configuration from 'shared/services/configuration/configuration'

import FormComponents from '../components/form'
import IncidentNavigation from '../components/IncidentNavigation'
import { validatePhoneNumber } from '../services/custom-validators/custom-validators'
import i18n from 'i18n'

export default {
  label: i18n.t('contactgegevens'),
  nextButtonLabel: i18n.t('volgende'),
  nextButtonClass: 'action primary arrow-right',
  previousButtonLabel: i18n.t('vorige'),
  previousButtonClass: 'action startagain',
  formAction: 'UPDATE_INCIDENT',
  form: {
    controls: {
      phone_email_text: {
        meta: {
          type: 'message',
          heading: i18n.t('mogen-we-u-bellen-voor-vragen-en-op-de-hoogte-houd'),
          value: i18n.t('vaak-hebben-we-nog-een-vraag-daarmee-kunnen-we-het'),
          wrappedComponent: FormComponents.PlainText,
        },
        render: FormComponents.WithHeading,
      },
      phone: {
        meta: {
          // https://bytes.grubhub.com/disabling-safari-autofill-for-a-single-line-address-input-b83137b5b1c7
          autoComplete: 'search_tel',
          autoRemove: /[^\d ()+-]/g,
          label: i18n.t('wat-is-uw-telefoonnummer'),
          path: 'reporter.phone',
          subtitle: '',
          type: 'tel',
          width: '50%',
        },
        render: FormComponents.TextInput,
        options: {
          validators: [validatePhoneNumber, ['maxLength', 17]],
        },
      },
      email: {
        meta: {
          autoComplete: 'search_email',
          autoRemove: /[^\w!#$%&'*+./;=?@^`{|}~-]/g,
          label: i18n.t('wat-is-uw-e-mailadres'),
          path: 'reporter.email',
          subtitle: '',
          type: 'email',
        },
        render: FormComponents.TextInput,
        options: {
          validators: ['email', ['maxLength', 100]],
        },
      },
      privacy_text: {
        meta: {
          type: 'message',
          heading: i18n.t('mogen-we-uw-melding-doorsturen'),
          value: i18n.t('soms-kan-de-gemeente-niets-doen-een-andere-organis'),
          wrappedComponent: FormComponents.PlainText,
        },
        render: FormComponents.WithHeading,
      },
      sharing_allowed: {
        meta: {
          shortLabel: i18n.t('toestemming-contactgegevens-delen'),
          value: i18n.t('ja-ik-geef-de-gemeente-toestemming-om-mijn-melding'),
          path: 'reporter.sharing_allowed',
        },
        render: FormComponents.EmphasisCheckboxInput,
      },
      $field_0: {
        isStatic: false,
        render: IncidentNavigation,
      },
      help_text: {
        meta: {
          label: i18n.t('lukt-het-niet-om-een-melding-te-doen-bel-het-telef'),
          value: i18n.t('wij-zijn-bereikbaar-van-maandag-tot-en-met-vrijdag'),
          ignoreVisibility: true,
        },
        render: FormComponents.PlainText,
      },
    },
  },
}
