// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2022 -2023 Vereniging van Nederlandse Gemeenten, Gemeente Amsterdam
import { render, screen } from '@testing-library/react'
import form from 'react-hook-form'

import { withAppContext } from 'test/utils'
import i18n from 'i18next'

import GlobalError from './index'

const defaultErrorMessage = `${i18n.t('u-hebt-niet-alle-vragen-beantwoord-vul-hieronder-a')}`

const invalidErrorMessage = `${i18n.t('u-hebt-niet-alle-vragen-juist-beantwoord-vul-hiero')}`

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFormContext: () => ({
    formState: {
      errors: { name: 'wrong name' },
    },
  }),
}))

describe('Form component <GlobalError />', () => {
  const props = {
    meta: {
      name: 'global',
      label: 'Error message',
    },
  }

  describe('rendering', () => {
    it('renders the error message when there is one in formState', () => {
      render(withAppContext(<GlobalError {...{ ...props }} />))

      expect(screen.getByText(props.meta.label)).toBeInTheDocument()
    })

    it('does not render error message', () => {
      jest.spyOn(form, 'useFormContext').mockImplementationOnce(() => ({
        formState: {
          errors: null,
        },
      }))
      render(withAppContext(<GlobalError {...{ ...props }} />))

      expect(screen.queryByText(props.meta.label)).toBe(null)
    })

    it('renders a default error message', () => {
      render(withAppContext(<GlobalError meta={{ name: 'global' }} />))

      expect(screen.getByText(defaultErrorMessage)).toBeInTheDocument()
    })

    it('renders an invalid error message', () => {
      jest.spyOn(form, 'useFormContext').mockImplementationOnce(() => ({
        formState: {
          errors: {
            dateTime: {
              type: 'custom',
            },
          },
        },
      }))
      render(
        withAppContext(<GlobalError meta={{ dateTime: { type: 'custom' } }} />)
      )

      expect(screen.getByText(invalidErrorMessage)).toBeInTheDocument()
    })
  })

  // test custom error message
  describe('render a custom error message', () => {
    jest.spyOn(form, 'useFormContext').mockImplementationOnce(() => ({
      formState: {
        errors: {
          extra_dieren_waar_dode_dieren: {
            message: {
              globalMessage:
                'U kunt dit formulier niet verder invullen. Lees onder de antwoorden waar u uw melding wel kunt doen.',
            },
          },
        },
      },
    }))
    render(
      withAppContext(
        <GlobalError meta={{ extra_dieren_waar_dode_dieren: { meta: {} } }} />
      )
    )

    expect(
      screen.getByText(
        'U kunt dit formulier niet verder invullen. Lees onder de antwoorden waar u uw melding wel kunt doen.'
      )
    ).toBeInTheDocument()
  })
})
