// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import i18n from 'i18n'
import type { Priority } from './types'

const priorityList: Priority[] = [
  {
    key: 'high',
    value: i18n.t('hoog'),
    info: i18n.t('melding-met-spoed-oppakken'),
    icon: 'PriorityHigh',
  },
  { 
    key: 'normal', 
    value: i18n.t('normaal') },
  {
    key: 'low',
    value: i18n.t('laag'),
    info: i18n.t('interne-melding-zonder-servicebelofte'),
  },
]

export default priorityList
