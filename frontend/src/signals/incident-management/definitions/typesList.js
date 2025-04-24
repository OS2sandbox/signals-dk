// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import i18n from 'i18n'
import configuration from 'shared/services/configuration/configuration'

export default [
  {
    key: 'SIG',
    value: i18n.t('melding'),
    info: i18n.t('een-verzoek-tot-herstel-of-handhaving-om-de-normale-situatie-te-herstellen-'),
  },
  {
    key: 'REQ',
    value: i18n.t('aanvraag'),
    info: i18n.t('een-verzoek-om-iets-structureels-te-veranderen-plaatsing-bankje-verplaatsen'),
  },
  {
    key: 'QUE',
    value: i18n.t('vraag'),
    info: i18n.t('een-verzoek-om-informatie-van-wie-is-die-camera-waarom-zijn-de-paaltjes-weg'),
  },
  {
    key: 'COM',
    value: i18n.t('klacht'),
    info: i18n.t('een-uiting-van-ongenoegen-over-het-handelen-van-de-gemeente'),
  },
  {
    key: 'MAI',
    value: configuration.featureFlags.useProjectenSignalType
      ? i18n.t('projecten')
      : i18n.t('groot-onderhoud'),
    info: configuration.featureFlags.useProjectenSignalType
      ? i18n.t('een-verzoek-dat-niet-onder-dagelijks-beheer-valt-maar-onder-een-project')
      : i18n.t('een-verzoek-dat-niet-onder-dagelijks-beheer-valt-maar-onder-een-langdurig-t'),
  },
]
