// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2021 Gemeente Amsterdam
import type { FunctionComponent } from 'react'
import { useMemo } from 'react'

import { Heading } from '@amsterdam/asc-ui'
import { useWatch } from 'react-hook-form'
import styled from 'styled-components'

import Paragraph from 'components/Paragraph/Paragraph'
import TextAreaComponent from 'components/TextArea'
import type { FieldProps } from 'signals/incident/containers/IncidentReplyContainer/types'
import i18n from 'i18n'

export const DEFAULT_MAX_LENGTH = 1000
const DEFAULT_ROWS = 6

const StyledHeading = styled(Heading).attrs({
  forwardedAs: 'h4',
})`
  && {
    margin-bottom: 0;
  }
`

const StyledParagraph = styled(Paragraph)`
  white-space: pre-wrap;
  word-break: break-word;
`

const TextArea: FunctionComponent<FieldProps> = ({
  errorMessage,
  label,
  shortLabel,
  id,
  control,
  register,
  rules,
}) => {
  const value = useWatch({
    control,
    name: id,
    defaultValue: '',
  }) as string
  const maxLength = rules?.maxLength ?? DEFAULT_MAX_LENGTH

  const infoText = useMemo(
    () => `${value.length}/${maxLength} ` + i18n.t('tekens'),
    [maxLength, value.length]
  )

  const Label = <StyledParagraph>{label}</StyledParagraph>

  return (
    <>
      <StyledHeading forwardedAs="h4">{shortLabel}</StyledHeading>
      <TextAreaComponent
        errorMessage={errorMessage}
        name={id}
        id={id}
        infoText={infoText}
        label={Label}
        rows={DEFAULT_ROWS}
        {...register(id, {
          validate: {
            required: (value: string) => {
              if (!value.trim()) {
                return i18n.t('dit-is-een-verplicht-veld')
              }
            },
          },
          maxLength: {
            message: i18n.t('u-heeft-meer-dan-de-maximale-maxlength-tekens-inge', { maxLength: maxLength }),
            value: maxLength,
          },
        })}
      />
    </>
  )
}

export default TextArea
