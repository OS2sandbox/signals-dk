// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2022 Gemeente Amsterdam
import memoize from 'lodash/memoize'
import some from 'lodash/some'

import { getIsAuthenticated } from 'shared/services/auth/auth'
import configuration from 'shared/services/configuration/configuration'
import {
  priorityList,
  typesList,
} from 'signals/incident-management/definitions'

import FormComponents from '../components/form'
import IncidentNavigation from '../components/IncidentNavigation'
import checkVisibility from '../services/checkVisibility'
import getStepControls from '../services/get-step-controls'
import i18n from 'i18n'

const priorityValuesList = priorityList.reduce(
  (acc, { key, value, info }) => ({ ...acc, [key]: { value, info } }),
  {}
)
const typesValuesList = typesList.reduce(
  (acc, { key, value, info }) => ({ ...acc, [key]: { value, info } }),
  {}
)
const selectableSources = (sources) =>
  sources.filter((source) => source.can_be_selected)
const reduceSources = (sources) =>
  sources.reduce(
    (acc, { value }) => [...acc, { [value]: value }],
    [{ '': i18n.t('vul-bron-in') }]
  )

export const renderSources = () => {
  if (getIsAuthenticated()) {
    return FormComponents.SelectInput
  } else {
    return FormComponents.HiddenInput
  }
}

const getControls = memoize(
  (sources) => ({
    controls: {
      error: {
        meta: {},
        render: FormComponents.GlobalError,
      },
      info_text: {
        meta: {
          type: 'message',
          value: `Voordat u een melding doet kunt u op de [meldingenkaart](/meldingenkaart) zien welke meldingen bekend zijn bij de
          gemeente.`,
        },
        render: configuration.featureFlags.enablePublicIncidentsMap
          ? FormComponents.PlainText
          : null,
      },
      source: {
        meta: {
          label: i18n.t('hoe-komt-de-melding-binnen'),
          path: 'source',
          values: sources ? reduceSources(selectableSources(sources)) : [],
          name: 'source',
          value: configuration.featureFlags.appMode ? i18n.t('aanvraag') : i18n.t('online'),
        },
        options: {
          validators: ['required'],
        },
        render: renderSources(),
      },
      description: {
        meta: {
          label: i18n.t('waar-gaat-het-om'),
          subtitle: i18n.t('typ-geen-persoonsgegevens-in-deze-omschrijving-we-'),
          path: 'text',
          rows: 7,
          maxLength: 1000,
        },
        options: {
          validators: ['required', ['maxLength', 1000]],
        },
        render: FormComponents.DescriptionInputRenderer,
      },
      subcategory: {
        meta: {
          label: i18n.t('subcategorie'),
          path: 'subcategory',
        },
        options: {
          validators: ['required'],
        },
        render: FormComponents.CategorySelectRenderer,
      },
      priority: {
        meta: {
          label: i18n.t('wat-is-de-urgentie'),
          path: 'priority',
          values: priorityValuesList,
        },
        options: {
          validators: ['required'],
        },
        authenticated: true,
        render: FormComponents.RadioInputGroup,
      },
      type: {
        meta: {
          label: 'Type',
          path: 'type',
          values: typesValuesList,
        },
        authenticated: true,
        render: FormComponents.RadioInputGroup,
        options: {
          validators: ['required'],
        },
      },
      images_previews: {
        meta: {
          label: 'images_previews',
        },
      },
      images: {
        meta: {
          label: i18n.t('fotos-toevoegen'),
          subtitle: i18n.t('voeg-een-foto-toe-om-de-situatie-te-verduidelijken'),
          minFileSize: 30 * 2 ** 10, // 30 KiB.
          maxFileSize: 20 * 2 ** 20, // 20 MiB.
          allowedFileTypes: [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
          ],
          maxNumberOfFiles: 3,
        },
        render: FormComponents.FileInputRenderer,
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
  }),
  () => ''
)

export default {
  label: i18n.t('beschrijf-uw-melding'),
  getNextStep: (wizard, incident) => {
    if (
      !some(getStepControls(wizard.vulaan, incident), (control) => {
        if (control.meta && !control.meta.ignoreVisibility) {
          return checkVisibility(control, incident)
        }
        return false
      })
    ) {
      return 'incident/contact'
    }
    return false
  },
  nextButtonLabel: i18n.t('volgende'),
  nextButtonClass: 'action primary arrow-right',
  formFactory: (incident, sources) => getControls(sources),
}
