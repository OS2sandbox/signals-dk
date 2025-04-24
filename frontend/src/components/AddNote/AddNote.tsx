// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2022 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import { forwardRef, useCallback, useEffect, useState } from 'react'
import type { ChangeEvent, ReactNode, SyntheticEvent, FocusEvent } from 'react'

import { themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import Button from 'components/Button'
import TextArea from 'components/TextArea'
import i18n from 'i18n'

export interface AddNoteProps {
  className?: string
  error?: string
  inForm?: boolean
  isStandalone?: boolean
  label?: ReactNode
  maxContentLength?: number
  name?: string
  onBlur?: (event: FocusEvent<HTMLTextAreaElement>) => void
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void
  onSubmit?: (
    event: SyntheticEvent<HTMLInputElement>,
    value?: string | null
  ) => boolean
  onCancel?: () => void
  id?: string
  rows?: number
  value?: string
  withToggle?: boolean
  description?: string
}

const NoteButton = styled(Button)`
  margin: ${themeSpacing(8, 2, 4, 0)};
`

export const getAddNoteError = (config: {
  fieldName?: string
  maxContentLength: number
  shouldContainAtLeastOneChar?: boolean
  text: string
}) => {
  const defaults = {
    fieldName: 'notitie',
    shouldContainAtLeastOneChar: true,
  }

  const { fieldName, maxContentLength, shouldContainAtLeastOneChar, text } = {
    ...defaults,
    ...config,
  }

  if (shouldContainAtLeastOneChar && text.trim() === '') {
    return i18n.t('de-fieldname-mag-niet-leeg-zijn', { fieldName })
  }

  if (text.length > maxContentLength) {
    return i18n.t('je-hebt-meer-dan-de-maximale-maxcontentlength-tekens-ingevoerd', { maxContentLength})
  }

  return ''
}

const AddNote = forwardRef<HTMLTextAreaElement, AddNoteProps>(
  (
    {
      className,
      error,
      isStandalone,
      inForm,
      withToggle,
      label,
      maxContentLength,
      name,
      onBlur,
      onChange,
      onSubmit,
      onCancel,
      id,
      rows,
      value,
      ...rest
    },
    ref: any
  ) => {
    const [showForm, setShowForm] = useState(!withToggle || !isStandalone)
    const handleSubmit = useCallback(
      (event) => {
        event.preventDefault()

        if (typeof onSubmit === 'function') {
          const successfulSubmit = onSubmit(event, ref?.current?.value)

          if (successfulSubmit && withToggle) {
            setShowForm(false)
          }
        }
      },
      [onSubmit, ref, withToggle]
    )

    const handleCancel = useCallback(() => {
      withToggle && setShowForm(false)
      onCancel && onCancel()
    }, [onCancel, withToggle])

    useEffect(() => {
      if (!showForm || !ref?.current || !isStandalone) return

      ref.current.focus()
    }, [isStandalone, ref, showForm, name])

    if (!showForm) {
      return (
        <section data-testid="add-note">
          <Button
            type="button"
            variant="application"
            data-testid="add-note-new-note-button"
            onClick={() => setShowForm(true)}
          >
            {i18n.t('notitie-toevoegen')}
          </Button>
        </section>
      )
    }
    return (
      <section className={className} data-testid="add-note">
        <TextArea
          data-testid="add-note-text"
          errorMessage={error}
          id={id || 'addNoteText'}
          maxContentLength={maxContentLength}
          name={name}
          onBlur={onBlur}
          onChange={onChange}
          ref={ref}
          rows={rows}
          label={!inForm && label}
          value={value || ''}
          {...rest}
        />

        {isStandalone && (
          <>
            <NoteButton
              data-testid="add-note-save-note-button"
              onClick={handleSubmit}
              type="submit"
              variant="secondary"
            >
              {i18n.t('opslaan')}
            </NoteButton>

            <NoteButton
              data-testid="add-note-cancel-note-button"
              variant="tertiary"
              type="button"
              onClick={handleCancel}
            >
              {i18n.t('annuleer')}
            </NoteButton>
          </>
        )}
      </section>
    )
  }
)

AddNote.defaultProps = {
  className: '',
  isStandalone: true,
  inForm: false,
  label: i18n.t('notitie-toevoegen'),
  rows: 10,
  withToggle: true,
}

export default AddNote
