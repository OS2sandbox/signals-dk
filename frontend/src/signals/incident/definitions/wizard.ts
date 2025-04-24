// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import type { Incident } from 'types/incident'

import type { SectionLabels } from '../components/IncidentPreview/IncidentPreview'

export type Sections =
  | 'beschrijf'
  | 'vulaan'
  | 'contact'
  | 'summary'
  | 'opslaan'
  | 'bedankt'
  | 'fout'

export type FormAction = 'UPDATE_INCIDENT' | 'CREATE_INCIDENT'

export type WizardSection = {
  [key in Sections]: WizardSectionProp
}

export type WizardSectionProp = {
  stepLabel?: string
  countAsStep?: boolean
  form?: any
  formFactory?: any
  label?: string
  subHeader?: string
  previewFactory?: (incident: Incident) => any
  sectionLabels?: SectionLabels
  previousButtonLabel?: string
  previousButtonClass?: string
  nextButtonLabel?: string
  formAction?: FormAction
}