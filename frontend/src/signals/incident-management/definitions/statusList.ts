// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { StatusCode } from 'types/status-code'

import type { Status } from './types'
import i18n from 'i18n'

export const GEMELD = {
  key: StatusCode.Gemeld,
  value: i18n.t('gemeld'),
  color: 'red',
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
}

export const AFWACHTING = {
  key: StatusCode.Afwachting,
  value: i18n.t('in-afwachting-van-behandeling'),
  color: 'purple',
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
}

export const BEHANDELING = {
  key: StatusCode.Behandeling,
  value: i18n.t('in-behandeling'),
  color: 'blue',
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
}

export const AFGEHANDELD = {
  key: StatusCode.Afgehandeld,
  value: i18n.t('afgehandeld'),
  color: 'lightgreen',
  email_sent_when_set: true,
  shows_remaining_sla_days: false,
}

export const GESPLITST = {
  key: StatusCode.Gesplitst,
  value: i18n.t('gesplitst'),
  color: 'lightgreen',
  email_sent_when_set: false,
  shows_remaining_sla_days: false,
}

export const INGEPLAND = {
  key: StatusCode.Ingepland,
  value: i18n.t('ingepland'),
  color: 'grey',
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
}

export const GEANNULEERD = {
  key: StatusCode.Geannuleerd,
  value: i18n.t('geannuleerd'),
  color: 'darkgrey',
  email_sent_when_set: false,
  shows_remaining_sla_days: false,
}

export const REACTIE_GEVRAAGD = {
  key: StatusCode.ReactieGevraagd,
  value: i18n.t('reactie-gevraagd'),
  email_sent_when_set: true,
  shows_remaining_sla_days: false,
}

export const REACTIE_ONTVANGEN = {
  key: StatusCode.ReactieOntvangen,
  value: i18n.t('reactie-ontvangen'),
  email_sent_when_set: false,
  shows_remaining_sla_days: false,
}

export const VERZOEK_TOT_HEROPENEN = {
  key: StatusCode.VerzoekTotHeropenen,
  value: i18n.t('verzoek-tot-heropenen'),
  color: 'orange',
  email_sent_when_set: false,
  shows_remaining_sla_days: false,
}

export const HEROPEND = {
  key: StatusCode.Heropend,
  value: i18n.t('heropend'),
  color: 'orange',
  email_sent_when_set: true,
  shows_remaining_sla_days: true,
}

export const TE_VERZENDEN = {
  key: StatusCode.TeVerzenden,
  value: i18n.t('extern-te-verzenden'),
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
}

export const VERZONDEN = {
  key: StatusCode.Verzonden,
  value: i18n.t('extern-verzonden'),
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
}

export const VERZENDEN_MISLUKT = {
  key: StatusCode.VerzendenMislukt,
  value: i18n.t('extern-mislukt'),
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
}

export const VERZOEK_TOT_AFHANDELING = {
  key: StatusCode.VerzoekTotAfhandeling,
  value: i18n.t('extern-verzoek-tot-afhandeling'),
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
}

export const DOORGEZET_NAAR_EXTERN = {
  key: StatusCode.DoorgezetNaarExtern,
  value: i18n.t('doorgezet-naar-extern'),
  email_sent_when_set: true,
  shows_remaining_sla_days: true,
}

export const AFGEHANDELD_EXTERN = {
  key: StatusCode.AfgehandeldExtern,
  value: i18n.t('extern-afgehandeld'),
  email_sent_when_set: false,
  shows_remaining_sla_days: true,
}

const statusList: Status[] = [
  GEMELD,
  AFWACHTING,
  BEHANDELING,
  REACTIE_GEVRAAGD,
  REACTIE_ONTVANGEN,
  AFGEHANDELD,
  INGEPLAND,
  GEANNULEERD,
  GESPLITST,
  VERZOEK_TOT_HEROPENEN,
  HEROPEND,
  TE_VERZENDEN,
  VERZONDEN,
  VERZENDEN_MISLUKT,
  VERZOEK_TOT_AFHANDELING,
  AFGEHANDELD_EXTERN,
  DOORGEZET_NAAR_EXTERN,
]

export default statusList

export const changeStatusOptionList = [
  GEMELD,
  AFWACHTING,
  REACTIE_GEVRAAGD,
  INGEPLAND,
  BEHANDELING,
  VERZOEK_TOT_AFHANDELING,
  AFGEHANDELD,
  HEROPEND,
  GEANNULEERD,
]

export const isStatusEnd = (status: StatusCode): boolean =>
  [
    StatusCode.Afgehandeld,
    StatusCode.Geannuleerd,
    StatusCode.Gesplitst,
  ].includes(status)

export const isStatusClosed = (status: StatusCode): boolean =>
  [StatusCode.Afgehandeld, StatusCode.Geannuleerd].includes(status)

export const defaultTextsOptionList = [...changeStatusOptionList]
