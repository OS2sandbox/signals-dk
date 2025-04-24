// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2021 Gemeente Amsterdam
import format from 'date-fns/format'
import i18n from 'i18n'

export const dateToISOString = (date) =>
  date &&
  `${String(date.getFullYear())}-${String(date.getMonth() + 1).padStart(
    2,
    '0'
  )}-${String(date.getDate()).padStart(2, '0')}`

export const dateToString = (date) => date && format(date, 'dd-MM-yyyy', date)

/**
 * @param {string} value
 * @returns string
 */
export const capitalize = (value) =>
  value && value[0].toUpperCase() + value.substring(1)

export const formatWeekOrWorkdays = (days, isCalendarDays) => {
  const dayString = days === 1 ? i18n.t('dag') : i18n.t('dagen')
  return isCalendarDays ? dayString : i18n.t('werk') + `${dayString}`
}

export const getDaysString = (days, isCalendarDays) =>
  `${days} ${formatWeekOrWorkdays(days, isCalendarDays)}`
