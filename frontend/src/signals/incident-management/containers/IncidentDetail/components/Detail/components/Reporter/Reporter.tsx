// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021-2023 Gemeente Amsterdam
import { Fragment } from 'react'

import { Link as AscLink } from '@amsterdam/asc-ui'
import { Link } from 'react-router-dom'

import { INCIDENT_URL } from 'signals/incident-management/routes'
import type { Reporter as ReporterType } from 'types/context'
import i18n from 'i18n'

export interface ReporterProps {
  reporter: ReporterType
  id: number
}

const Reporter: React.FC<ReporterProps> = ({
  reporter: { signal_count, open_count, negative_count },
  id,
}) => (
  <Fragment>
    <dt data-testid="detail-reporter-definition">{i18n.t('meldingen-van-deze-melder')}</dt>
    <dd data-testid="detail-reporter-value">
      <AscLink
        as={Link}
        variant="inline"
        to={`../${INCIDENT_URL}/${id}/melder`}
      >
        {signal_count} {signal_count === 1 ? i18n.t('melding') : i18n.t('meldingen')}
      </AscLink>
      <div>
        {negative_count}x {i18n.t('niet-tevreden')} / {open_count}x {i18n.t('openstaand')}
      </div>
    </dd>
  </Fragment>
)

export default Reporter
