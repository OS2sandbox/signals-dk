// SPDX-License-Identifier: MPL-2.0
import i18n from "i18n"

// Copyright (C) 2019 - 2023 Gemeente Amsterdam
type Data = Array<Record<string, any>>
type ColMap = Record<string, any>

/**
 * Clean-up of API response
 *
 * Filtering out invalid keys, turning array values into concatenated strings and
 * converting boolean values to readable text values
 */
const filterData = (data: Data, colMap: ColMap): Array<typeof colMap> => {
  const allowedKeys = Object.keys(colMap)

  return (
    (data &&
      data?.map((item) =>
        Object.keys(item)
          .filter((key) => allowedKeys.includes(key))
          .reduce((rawObj: ColMap, key: string) => {
            const obj = { ...rawObj }
            let value = Array.isArray(item[key])
              ? item[key].join(', ')
              : item[key]

            if (typeof value === 'boolean') {
              value = value ? i18n.t('actief') : i18n.t('niet-actief')
            }

            if (key === 'public_name') {
              value = value || item.value
            }

            if (key === '_links') {
              value = value['sia:icon']
                ? value['sia:icon'].href
                : i18n.t('niet-ingesteld')
            }

            obj[colMap[key]] = value

            return obj
          }, {})
      )) ||
    []
  )
}

export default filterData
