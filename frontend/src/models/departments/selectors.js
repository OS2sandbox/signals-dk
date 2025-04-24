// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import { createSelector } from 'reselect'

import { initialState } from './reducer'
import i18n from 'i18n'

export const selectDepartmentsDomain = (state) =>
  state?.departments || initialState

/**
 * Other specific selectors
 */
export const departmentsInputOptions = (state) => [
  ...state
    .get('list')
    .toJS()
    .map((department) => ({
      key: department.code,
      name: department.name,
      value: department.code,
    })),
]

export const makeSelectDepartments = createSelector(
  selectDepartmentsDomain,
  (state) => state.toJS()
)

export const inputSelectDepartmentsSelector = createSelector(
  selectDepartmentsDomain,
  (state) => [
    { key: '', name: i18n.t('alles'), value: '*' },
    ...departmentsInputOptions(state),
  ]
)
export const makeSelectDirectingDepartments = createSelector(
  makeSelectDepartments,
  (state) => {
    const directingDepartments = state?.list.filter(
      (department) => department.can_direct
    )
    return [
      { key: 'null', value: i18n.t('verantwoordelijke-afdeling') },
      ...directingDepartments.map(({ code }) => ({ key: code, value: code })),
    ]
  }
)

export const makeSelectRoutingDepartments = createSelector(
  makeSelectDepartments,
  (state) => {
    const routingDepartments = state?.list
    return [
      { key: 'null', value: i18n.t('niet-gekoppeld') },
      ...routingDepartments.map(({ code, name }) => ({
        key: code,
        value: name,
      })),
    ]
  }
)
