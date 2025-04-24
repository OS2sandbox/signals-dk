// SPDX-License-Identifier: MPL-2.0

import i18n from "i18n"

// Copyright (C) 2019 - 2021 Gemeente Amsterdam
enum FeedbackKey {
  SATISFIED = 'satisfied',
  NOT_SATISFIED = 'not_satisfied',
  NOT_RECEIVED = 'not_received',
}

export type Feedback = {
  key: FeedbackKey
  value: string
}

const feedbackList: Array<Feedback> = [
  {
    key: FeedbackKey.SATISFIED,
    value: i18n.t('tevreden'),
  },
  {
    key: FeedbackKey.NOT_SATISFIED,
    value: i18n.t('niet-tevreden'),
  },
  {
    key: FeedbackKey.NOT_RECEIVED,
    value: i18n.t('niet-ontvangen'),
  },
]

export default feedbackList
