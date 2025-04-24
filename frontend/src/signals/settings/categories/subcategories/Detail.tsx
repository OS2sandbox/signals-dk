// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
/* istanbul ignore file */
import i18n from 'i18n'
import { CategoryDetail } from '../components'

export const DetailContainer = () => (
  <CategoryDetail
    isMainCategory={false}
    entityName={i18n.t('subcategorie')}
    isPublicAccessibleLabel={i18n.t('toon-meldingen-van-deze-subcategorie-op-openbare-kaarten-en-op-de-kaart-in-')}
  />
)

export default DetailContainer
