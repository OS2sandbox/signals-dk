// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2020 - 2023 Gemeente Amsterdam
import type { FunctionComponent } from 'react'

import { Close } from '@amsterdam/asc-assets'
import {
  Button,
  Link as AscLink,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { getIsAuthenticated } from 'shared/services/auth/auth'
import { string2date, string2time } from 'shared/services/string-parser'
import { statusList } from 'signals/incident-management/definitions'
import { INCIDENT_URL } from 'signals/incident-management/routes'
import type { StatusCode } from 'types/status-code'

import type { IncidentSummary } from '../types'
import i18n from 'i18n'

const statuses = statusList.reduce(
  (acc, status) => ({
    ...acc,
    [status.key]: status.value,
  }),
  {}
) as Record<StatusCode, string>

const StyledMetaList = styled.dl`
  margin: 0;

  dt {
    color: ${themeColor('tint', 'level5')};
    margin-bottom: ${themeSpacing(1)};
    position: relative;
    font-weight: 400;
  }

  dd {
    &:not(:last-child) {
      margin-bottom: ${themeSpacing(2)};
    }

    &.alert {
      color: ${themeColor('secondary')};
    }
  }
`

const Panel = styled.div`
  padding: 12px;
  background: white;
  outline: 2px solid rgba(0, 0, 0, 0.1);
  z-index: 401;
  display: flex;
  flex-direction: column;
  align-items: left;
  width: 350px;
  max-width: calc(100% - 40px);
  justify-content: space-between;
`

const PanelHeader = styled.div`
  padding-bottom: 12px;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`

interface DetailPanelProps {
  incident: IncidentSummary
  onClose: () => void
}

const DetailPanel: FunctionComponent<DetailPanelProps> = ({
  incident,
  onClose,
}) => (
  <Panel data-testid="map-detail-panel">
    <PanelHeader>
      {getIsAuthenticated() ? (
        <AscLink
          as={Link}
          variant="inline"
          to={`../${INCIDENT_URL}/${incident.id}`}
        >
          {i18n.t('melding')} {incident.id}
        </AscLink>
      ) : (i18n.t('melding') + ` ${incident.id}`)}
      <Button
        size={36}
        variant="blank"
        iconSize={14}
        icon={<Close />}
        onClick={onClose}
      />
    </PanelHeader>
    {(incident.created_at ||
      (incident.status && statuses[incident.status]) ||
      incident.category?.sub ||
      incident.category?.main) && (
      <StyledMetaList>
        {incident.created_at && (
          <dt data-testid="meta-list-date-definition">{i18n.t('gemeld-op')}</dt>
        )}
        {incident.created_at && (
          <dd data-testid="meta-list-date-value">
            {string2date(incident.created_at)}{' '}
            {string2time(incident.created_at)}
          </dd>
        )}
        {incident.status && statuses[incident.status] && (
          <dt data-testid="meta-list-status-definition">{i18n.t('status')}</dt>
        )}
        {incident.status && statuses[incident.status] && (
          <dd className="alert" data-testid="meta-list-status-value">
            {statuses[incident.status]}
          </dd>
        )}
        {incident.category?.sub && (
          <dt data-testid="meta-list-subcategory-definition">{i18n.t('subcategorie')}</dt>
        )}
        {incident.category?.sub && (
          <dd data-testid="meta-list-subcategory-value">
            {incident.category.sub}
          </dd>
        )}
        {incident.category?.main && (
          <dt data-testid="meta-list-category-definition">{i18n.t('hoofdcategorie')}</dt>
        )}
        {incident.category?.main && (
          <dd data-testid="meta-list-category-value">
            {incident.category.main}
          </dd>
        )}
      </StyledMetaList>
    )}
  </Panel>
)
export default DetailPanel
