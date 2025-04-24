import { Heading, Icon, themeSpacing, List, ListItem } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import configuration from 'shared/services/configuration/configuration'
import { dateToString } from 'shared/services/date-utils'
import i18n from 'i18n'

interface FilterProps {
  subcategory?: string
  departments?: string
  startDate: string
}

const ICON_SIZE = 20

const Wrapper = styled.section`
  padding: ${themeSpacing(4)};
`

const Field = styled.div`
  margin-top: ${themeSpacing(4)};
`

const Title = styled.div`
  font-weight: bold;
  margin-bottom: ${themeSpacing(2)};
`

const StyledIcon = styled(Icon)`
  display: inline-block;
  margin-right: ${themeSpacing(4)};
  position: relative;
  top: 4px;
`

const Filter: React.FC<FilterProps> = (props) => {
  const subcategory = props.subcategory ? (
    <Field>
      <Title data-testid="subcategory-label">
        {i18n.t('subcategorie-verantwoordelijke-afdeling')}
      </Title>
      <List>
        <ListItem>
          <span data-testid="subcategory">{props.subcategory} </span>
          <span data-testid="departments">({props.departments})</span>
        </ListItem>
      </List>
    </Field>
  ) : null

  return (
    <Wrapper>
      <Heading>{i18n.t('filter')}</Heading>
      {subcategory}
      <Field>
        <Title data-testid="status-label">{i18n.t('status')}</Title>
        <List>
          <ListItem>
            <StyledIcon size={ICON_SIZE}>
              <img
                alt={i18n.t('groene-locatie-pin')}
                src="/assets/images/area-map/icon-pin.svg"
              />
            </StyledIcon>
            {i18n.t('openstaand')}
          </ListItem>
          <ListItem>
            <StyledIcon size={ICON_SIZE}>
              <img
                alt={i18n.t('zwarte-locatie-pin')}
                src="/assets/images/area-map/icon-pin-green.svg"
              />
            </StyledIcon>
            {i18n.t('afgehandeld')}
          </ListItem>
        </List>
      </Field>

      <Field>
        <Title data-testid="period-label">{i18n.t('periode')}</Title>
        <List>
          <ListItem data-testid="period">
            {i18n.t('van')} {dateToString(new Date(props.startDate))} {i18n.t('t-m-nu')}
          </ListItem>
        </List>
      </Field>

      <Field>
        <Title data-testid="area-label">{i18n.t('omgeving')}</Title>
        <List>
          <ListItem>
            <StyledIcon size={ICON_SIZE}>
              <img
                alt={i18n.t('draadkruis')}
                src="/assets/images/area-map/icon-cross-small.svg"
              />
            </StyledIcon>
            {i18n.t('locatie-huidige-melding')}
          </ListItem>
          <ListItem>
            <StyledIcon size={ICON_SIZE}>
              <img alt={i18n.t('straal')} src="/assets/images/area-map/icon-radius.svg" />
            </StyledIcon>
            {i18n.t('straal') + `${configuration.map.optionsAreaMap.focusRadiusMeters} m`}
          </ListItem>
        </List>
      </Field>
      <Field>
        <Title forwardedAs="h4" data-testid="kind-label">
          {i18n.t('soort')}
        </Title>
        <List>
          <ListItem>{i18n.t('standaardmelding')}</ListItem>
          <ListItem>{i18n.t('deelmelding')}</ListItem>
        </List>
      </Field>
    </Wrapper>
  )
}

export default Filter
