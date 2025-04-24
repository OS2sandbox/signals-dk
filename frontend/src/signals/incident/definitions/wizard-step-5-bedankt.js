// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam

import configuration from 'shared/services/configuration/configuration'

import FormComponents from '../components/form'
import IncidentNavigation from '../components/IncidentNavigation'
import i18n from 'i18n'

const navigation = configuration.featureFlags.appMode
  ? {
      app_close_window_action: {
        meta: {
          title: i18n.t('wilt-u-nog-een-andere-melding-doen'),
          labelCloseButton: i18n.t('sluit-venster'),
          labelLinkButton: i18n.t('doe-een-melding'),
          hrefLinkButton: '/',
        },
        render: FormComponents.AppNavigation,
      },
    }
  : {
      next_incident_action: {
        meta: {
          label: i18n.t('doe-een-melding'),
          href: '/',
        },
        render: FormComponents.LinkButton,
      },
    }

export default {
  label: i18n.t('bedankt'),
  form: {
    controls: {
      confirmation_message: {
        meta: {
          type: 'message',
          value: i18n.t('uw-melding-is-bij-ons-bekend-onder-nummer-incident'),
          valueAuthenticated: i18n.t('uw-melding-is-bij-ons-bekend-onder-nummer-incident-id_display-manage-incide'),
        },
        render: FormComponents.PlainText,
      },
      handling_message: {
        meta: {
          title: i18n.t('wat-doen-we-met-uw-melding'),
          key: 'incident.handling_message',
        },
        render: FormComponents.HandlingMessage,
      },

      ...navigation,

      $field_0: {
        isStatic: false,
        render: IncidentNavigation,
      },
    },
  },
}
