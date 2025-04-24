// Copyright (C) 2023 Gemeente Amsterdam
import type { FunctionComponent } from 'react'
import { useEffect } from 'react'

import {
  PersonalLogin,
  Student,
  Buildings,
  ThumbnailResults,
  Download,
} from '@amsterdam/asc-assets'
import { CompactThemeProvider, Row } from '@amsterdam/asc-ui'

import PageHeader from 'components/PageHeader'
import configuration from 'shared/services/configuration/configuration'
import {
  USERS_URL,
  ROLES_URL,
  DEPARTMENTS_URL,
  SUBCATEGORIES_URL,
  EXPORT_URL,
  MAIN_CATEGORIES_URL,
} from 'signals/settings/routes'

import {
  StyledVersionNumbers,
  StyledNavLink,
  StyledTopTaskLink,
  Item,
  Wrapper,
} from './styled'
import useFetch from '../../../../../hooks/useFetch'
import i18n from 'i18n'

type Keys =
  | 'departments'
  | 'groups'
  | 'settings'
  | 'users'
  | 'categories'
  | 'export'

interface Props {
  showItems: Record<Keys, boolean | undefined>
}

const Overview: FunctionComponent<Props> = ({ showItems }) => {
  const { data, get } = useFetch<{ version: string }>()

  useEffect(() => {
    get(`${configuration.apiBaseUrl}/signals/`)
  }, [get])

  if (!showItems.settings) {
    return null
  }

  return (
    <CompactThemeProvider>
      <Row>
        <PageHeader title={i18n.t('instellingen')}>
          <StyledVersionNumbers>
            {'\n' + i18n.t('versienummer-frontend') + `: ${process.env.FRONTEND_TAG}
            ` + i18n.t('versienummer-backend') + `: ${data?.version}`}
          </StyledVersionNumbers>
        </PageHeader>
      </Row>
      <Row>
        <Wrapper>
          {showItems.users && (
            <Item data-testid="users">
              <StyledNavLink to={USERS_URL}>
                <StyledTopTaskLink
                  forwardedAs="div"
                  icon={PersonalLogin}
                  title={i18n.t('gebruikers')}
                />
              </StyledNavLink>
              <p>
                {i18n.t('om-toegang-te-krijgen-tot-de-applicatie-signalen-is-het-noodzakelijk-dat-ee')}
              </p>
            </Item>
          )}
          {showItems.groups && (
            <Item data-testid="groups">
              <StyledNavLink to={ROLES_URL}>
                <StyledTopTaskLink
                  forwardedAs="div"
                  icon={Student}
                  title={i18n.t('rollen')}
                />
              </StyledNavLink>
              <p>
                {i18n.t('de-applicatie-signalen-kent-verscheidene-rollen-in-het-instellingenscherm-i')}
              </p>
            </Item>
          )}
          {showItems.departments && (
            <Item data-testid="departments">
              <StyledNavLink to={DEPARTMENTS_URL}>
                <StyledTopTaskLink
                  forwardedAs="div"
                  icon={Buildings}
                  title={i18n.t('afdelingen')}
                />
              </StyledNavLink>
              <p>
                {i18n.t('de-applicatie-signalen-maakt-gebruik-van-afdelingen-per-afdeling-is-het-mog')}
              </p>
            </Item>
          )}
          {showItems.categories && (
            <Item data-testid="categories">
              <StyledNavLink to={SUBCATEGORIES_URL}>
                <StyledTopTaskLink
                  forwardedAs="div"
                  icon={ThumbnailResults}
                  title={i18n.t('subcategorieen')}
                />
              </StyledNavLink>
              <p>
                {i18n.t('elke-melding-in-de-applicatie-signalen-wordt-bij-het-aanmaken-door-een-mach')}
              </p>
            </Item>
          )}
          {configuration.featureFlags.showMainCategories &&
            showItems.categories && (
              <Item data-testid="main-categories">
                <StyledNavLink to={MAIN_CATEGORIES_URL}>
                  <StyledTopTaskLink
                    forwardedAs="div"
                    icon={ThumbnailResults}
                    title={i18n.t('hoofdcategorieen')}
                  />
                </StyledNavLink>
                <p>
                  {i18n.t('een-melding-in-signalen-wordt-automatisch-door-de-machine-learning-tool-toe')}
                </p>
              </Item>
            )}
          {configuration.featureFlags.enableCsvExport && showItems.export && (
            <Item data-testid="export">
              <StyledNavLink to={EXPORT_URL}>
                <StyledTopTaskLink
                  forwardedAs="div"
                  icon={Download}
                  title="CSV Export"
                />
              </StyledNavLink>
              <p>{i18n.t('voor-het-downloaden-van-alle-meldingen-in-csv-formaat')}</p>
            </Item>
          )}
        </Wrapper>
      </Row>
    </CompactThemeProvider>
  )
}

export default Overview
