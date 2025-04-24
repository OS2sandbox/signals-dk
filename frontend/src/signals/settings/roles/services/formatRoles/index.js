// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2021 Gemeente Amsterdam
import i18n from 'i18n'

const roleName = i18n.t('naam')
const rolePermissions = i18n.t('rechten')

const formatRoles = (items) => {
  const roles = []
  items.forEach((role) => {
    const permissions = []

    role.permissions.forEach((permission) => {
      permissions.push(permission.name)
    })

    roles.push({
      id: role.id,
      [roleName]: role.name,
      [rolePermissions]: permissions.join(', '),
    })
  })

  return roles
}

export default formatRoles
