// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2022 Gemeente Amsterdam
import type { FC } from 'react'

import { Link } from 'react-router-dom'

import { Tab, TabContainer } from 'components/Tab'
import configuration from 'shared/services/configuration/configuration'

import { MapHeading } from './styled'
import { MAP_URL, INCIDENTS_URL } from '../../../../routes'
import i18n from 'i18n'

type SubNavProps = {
  showsMap?: boolean
}

const SubNav: FC<SubNavProps> = ({ showsMap }) => (
  <>
    {showsMap && configuration.featureFlags.mapFilter24Hours && (
      <MapHeading data-testid="sub-nav-header">{i18n.t('afgelopen-24-uur')}</MapHeading>
    )}

    <TabContainer data-testid="sub-nav">
      {showsMap ? (
        <>
          <Tab data-testid="sub-nav-list-link" as={Link} to={INCIDENTS_URL}>
          {i18n.t('lijst')}
          </Tab>
          <Tab className="active">
          <span>{i18n.t('kaart')}</span>
          </Tab>
        </>
      ) : (
        <>
          <Tab className="active">
          {i18n.t('lijst')}
          </Tab>
          <Tab data-testid="sub-nav-map-link" as={Link} to={MAP_URL}>
          <span>{i18n.t('kaart')}</span>
          </Tab>
        </>
      )}
    </TabContainer>
  </>
)

SubNav.defaultProps = {
  showsMap: false,
}

export default SubNav
