import type { FunctionComponent } from 'react'
import { useEffect } from 'react'

import { themeSpacing, Column } from '@amsterdam/asc-ui'
import styled from 'styled-components'

import LoadingIndicator from 'components/LoadingIndicator'
import Notification from 'components/Notification'
import useGetReportOpen from 'hooks/api/useGetReportOpen'
import useGetReportReopenRequested from 'hooks/api/useGetReportReopenRequested'
import type { Report } from 'types/api/report'

import BarGraph from './components/BarGraph'
import { Color as GraphColor } from './components/BarGraph/BarGraph'
import GraphDescription from './components/GraphDescription'
import GraphEmpty from './components/GraphEmpty'
import i18n from 'i18n'

const StyledColumn = styled(Column)`
  height: 100%;
  border-bottom: 2px solid;
  padding-top: ${themeSpacing(6)};
  padding-bottom: ${themeSpacing(8)};

  @media (max-width: ${({ theme }) => theme.layouts.large.min}px) {
    margin-bottom: ${themeSpacing(8)};
  }
`

const endReopenRequestedDate = new Date()
const daysInThePast = 14
endReopenRequestedDate.setDate(endReopenRequestedDate.getDate() - daysInThePast)
const endReopenRequested = endReopenRequestedDate.toISOString()

const Signaling: FunctionComponent = () => {
  const {
    isLoading: openLoading,
    data: openData,
    error: errorOpen,
    get: getReportOpen,
  } = useGetReportOpen()

  const {
    isLoading: reopenRequestedLoading,
    data: reopenRequestedData,
    error: errorReopenRequested,
    get: getReportReopenRequested,
  } = useGetReportReopenRequested()

  useEffect(() => {
    getReportOpen()
    getReportReopenRequested({ end: endReopenRequested })
  }, [getReportOpen, getReportReopenRequested])

  const getGraphDataFromReport = (report?: Report) => {
    if (!report) return []

    return report.results.map(({ category, signal_count }) => {
      const item = {
        description: category.name,
        value: signal_count,
      }

      if (category.departments.length > 0) {
        item.description = `${category.name} (${category.departments.join(
          ', '
        )})`
      }

      return item
    })
  }

  const graphDataOpen = getGraphDataFromReport(openData)
  const totalOpen = openData ? openData.total_signal_count : null
  const graphDataReopenRequested = getGraphDataFromReport(reopenRequestedData)
  const totalReopenRequested = reopenRequestedData
    ? reopenRequestedData.total_signal_count
    : null

  if (errorOpen || errorReopenRequested) {
    return (
      <Notification
        title={i18n.t('er-is-iets-misgegaan')}
        message={i18n.t('de-data-kon-niet-worden-opgehaald')}
        variant="error"
      />
    )
  }

  if (openLoading || reopenRequestedLoading) {
    return <LoadingIndicator />
  }

  return (
    <>
      <StyledColumn span={6} wrap>
        {totalOpen !== null ? (
          <GraphDescription
            title={i18n.t('buiten-de-afhandeltermijn')}
            description={i18n.t('alle-openstaande-meldingen-waarvan-de-doorlooptijd-langer-is-dan-3x-de-afha')}
            total={totalOpen}
          />
        ) : null}

        {totalOpen === 0 ? (
          <GraphEmpty text={i18n.t('hier-is-niks-meer-te-signaleren')} />
        ) : (
          <BarGraph
            maxValue={1000}
            data={graphDataOpen}
            color={GraphColor.Red}
          />
        )}
      </StyledColumn>
      <StyledColumn span={6} wrap>
        {totalReopenRequested !== null && (
          <GraphDescription
            title={i18n.t('verzoek-tot-heropenen')}
            description={i18n.t('meldingen-waarbij-de-melder-langer-dan-2-weken-geleden-een-verzoek-tot-hero')}
            total={totalReopenRequested}
          />
        )}

        {totalReopenRequested === 0 ? (
          <GraphEmpty text={i18n.t('hier-is-niks-meer-te-signaleren')} />
        ) : (
          <BarGraph
            maxValue={1000}
            data={graphDataReopenRequested}
            color={GraphColor.Blue}
          />
        )}
      </StyledColumn>
    </>
  )
}

export default Signaling
