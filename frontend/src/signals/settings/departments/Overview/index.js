// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2019 - 2023 Gemeente Amsterdam
import { Fragment, useCallback } from 'react'

import { Row, Column } from '@amsterdam/asc-ui'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import BackLink from 'components/BackLink'
import ListComponent from 'components/List'
import LoadingIndicator from 'components/LoadingIndicator'
import PageHeader from 'components/PageHeader'
import { makeSelectUserCan } from 'containers/App/selectors'
import { makeSelectDepartments } from 'models/departments/selectors'
import { BASE_URL, DEPARTMENT_URL } from 'signals/settings/routes'
import i18n from 'i18n'
import filterData from '../../utils/filterData'
import { sub } from 'date-fns'

const StyledList = styled(ListComponent)`
  th {
    font-weight: 400;
  }

  th:first-child {
    width: 250px;
  }
`

const displayName = i18n.t('naam')
const subCategoryName = i18n.t('subcategorie')

const colMap = {
  id: 'id',
  _display: displayName,
  category_names: subCategoryName,
}

const DepartmentOverview = () => {
  const departments = useSelector(makeSelectDepartments)
  const userCan = useSelector(makeSelectUserCan)
  const navigate = useNavigate()

  const onItemClick = useCallback(
    (event) => {
      if (!userCan('change_department')) {
        event.preventDefault()
        return
      }

      const {
        currentTarget: {
          dataset: { itemId },
        },
      } = event

      if (itemId) {
        navigate(`${BASE_URL}/${DEPARTMENT_URL}/${itemId}`)
      }
    },
    [navigate, userCan]
  )

  const data = filterData(departments.list, colMap)

  console.log('data', data);
  
  return (
    <Fragment>
      <Row>
        <PageHeader
          dataTestId={'settings-page-header'}
          title={i18n.t('afdelingen') + `${departments.count ? ` (${departments.count})` : ''}`}
          BackLink={<BackLink to={BASE_URL}>{i18n.t('terug-naar-instellingen')}</BackLink>}
        />
      </Row>
      <Row>
        {departments.loading && <LoadingIndicator />}

        <Column span={12}>
          {!departments.loading && data && (
            <StyledList
              columnOrder={[displayName, subCategoryName]}
              items={data}
              onItemClick={onItemClick}
              primaryKeyColumn="id"
            />
          )}
        </Column>
      </Row>
    </Fragment>
  )
}

export default DepartmentOverview
