import { WizardSection } from './wizard'
import beschrijf from './wizard-step-1-beschrijf'
import vulaan from './wizard-step-2-vulaan'
import contact from './wizard-step-3-contact'
import summary from './wizard-step-4-summary'
import bedankt from './wizard-step-5-bedankt'
import fout from './wizard-step-6-fout'
import i18n from 'i18n'

export default function getWizardSections(): WizardSection {
  const section1Title = i18n.t('beschrijf-uw-melding')
  const section2Title = i18n.t('locatie-en-vragen')
  const section3Title = i18n.t('contactgegevens')
  const section4Title = i18n.t('versturen')
  return {
    beschrijf: {
      stepLabel: section1Title,
      countAsStep: true,
      ...beschrijf,
    },
    vulaan: {
      stepLabel: section2Title,
      countAsStep: true,
      ...vulaan,
    },
    contact: {
      stepLabel: section3Title,
      countAsStep: true,
      ...contact,
    },
    summary: {
      stepLabel: section4Title,
      countAsStep: true,
      ...summary,
    },
    opslaan: {},
    bedankt,
    fout,
  } as WizardSection
}

