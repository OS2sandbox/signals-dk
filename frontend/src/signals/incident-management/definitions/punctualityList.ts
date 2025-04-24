// SPDX-License-Identifier: MPL-2.0

import i18n from "i18n"

// Copyright (C) 2021 Gemeente Amsterdam
enum PunctualityKey {
  ON_TIME = 'on_time',
  LATE = 'late',
  LATE_FACTOR_3 = 'late_factor_3',
}

export type Punctuality = {
  key: PunctualityKey
  value: string
}

const punctualityList: Array<Punctuality> = [
  {
    key: PunctualityKey.ON_TIME,
    value: i18n.t('binnen-de-afhandeltermijn'),
  },
  {
    key: PunctualityKey.LATE,
    value: i18n.t('buiten-de-afhandeltermijn'),
  },
  {
    key: PunctualityKey.LATE_FACTOR_3,
    value: i18n.t('3x-buiten-de-afhandeltermijn'),
  },
]

export default punctualityList
