// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import configuration from 'shared/services/configuration/configuration'
import FormComponents from '../components/form'
import IncidentNavigation from '../components/IncidentNavigation'
import i18n from 'i18n'

export default {
  label: i18n.t('fout'),
  previousButtonLabel: i18n.t('vorige'),
  previousButtonClass: 'action startagain',
  formAction: 'UPDATE_INCIDENT',
  form: {
    controls: {
      text: {
        meta: {
          className: 'col-sm-12 col-md-6',
          label:
            i18n.t('momenteel-zijn-er-problemen-met-deze-website-en-kan-uw-melding-niet-verwerk'),
          type: 'bedankt',
          value: i18n.t('probeert-u-het-later-nogmaals') + `${configuration.language?.urgentContactInfo}`,
        },
        render: FormComponents.PlainText,
      },
      $field_0: {
        isStatic: false,
        render: IncidentNavigation,
      },
      help_text: {
        meta: {
          label: i18n.t('lukt-het-niet-om-een-melding-te-doen-bel-het-telef'),
          value: i18n.t('wij-zijn-bereikbaar-van-maandag-tot-en-met-vrijdag'),
        },
        render: FormComponents.PlainText
      },
    },
  },
}
