// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2023 Gemeente Amsterdam
import { Column, Row } from '@amsterdam/asc-ui'

import { StyledH1 } from './styled'
import Signaling from '../../components/Signaling'
import i18n from 'i18n'

export const SignalingContainer = () => {
  return (
    <Row>
      <Column span={12}>
        <StyledH1>{i18n.t('signalering')}</StyledH1>
      </Column>
      <Signaling />
    </Row>
  )
}
