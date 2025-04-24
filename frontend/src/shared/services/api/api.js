// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import { call } from 'redux-saga/effects'
import { getAuthHeaders } from 'shared/services/auth/auth'
import request from 'utils/request'
import i18n from 'i18n'

export const generateParams = (data) =>
  Object.entries(data)
    .filter((pair) => pair[1])
    .map((pair) =>
      Array.isArray(pair[1]) === true
        ? pair[1]
            .filter((val) => val)
            .map((val) => `${pair[0]}=${val}`)
            .join('&')
        : pair.map(encodeURIComponent).join('=')
    )
    .join('&')

export function* authCall(url, params, authorizationToken) {
  const headers = {
    ...getAuthHeaders(),
    accept: 'application/json',
  }

  if (authorizationToken) {
    headers.Authorization = `Bearer ${authorizationToken}`
  }

  const options = {
    method: 'GET',
    headers,
  }
  const fullUrl = `${url}${params ? `?${generateParams(params)}` : ''}`
  return yield call(request, fullUrl, options)
}

export function* authCallWithPayload(url, params, method) {
  const headers = {
    ...getAuthHeaders(),
    accept: 'application/json',
    'Content-Type': 'application/json',
  }

  const options = {
    method,
    headers,
    body: JSON.stringify(params),
  }

  const fullUrl = `${url}`
  return yield call(request, fullUrl, options)
}

export function* authPostCall(url, params) {
  return yield call(authCallWithPayload, url, params, 'POST')
}

export function* authDeleteCall(url, params) {
  return yield call(authCallWithPayload, url, params, 'DELETE')
}

export function* authPatchCall(url, params) {
  return yield call(authCallWithPayload, url, params, 'PATCH')
}

export function* postCall(url, params) {
  const options = {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json',
    },
  }

  return yield call(request, url, options)
}

function getErrorMessageDictionary(errorCode) {
  switch(errorCode) {
    case 400: return i18n.t('deze-wijziging-is-niet-toegestaan-in-deze-situatie');
    case 401: return i18n.t('om-de-opgevraagde-gegevens-te-bekijken-is-een-geautoriseerde-sessie-noodzak');
    case 403: return i18n.t('je-hebt-niet-voldoende-rechten-om-deze-actie-uit-te-voeren');
    case 408: return i18n.t('het-verzoek-kan-niet-verwerkt-worden-door-een-timeout-op-de-server');
    case 413: return i18n.t('de-grootte-van-de-payload-overschrijdt-de-toegestane-limiet');
    case 418: return i18n.t('de-ober-weigert-koffie-te-zetten-omdat-het-een-theepot-is');
    case 429: return i18n.t('er-zijn-teveel-verzoeken-verstuurd');
    case 500: return i18n.t('interne-fout-op-de-server-probeer-het-nogmaals');
    case 503: return i18n.t('server-is-op-dit-moment-niet-beschikbaar-probeer-het-nogmaals');
    default: return i18n.t('de-opgevraagde-gegevens-konden-niet-gevonden-worden');
  }
}

/**
 * Get an error message based on an error's status code
 *
 * @returns {String}
 */
export function getErrorMessage(error, defaultErrorMessage = '') {
  const status = error?.response?.status || error?.status

  if (!status) {
    return (
      error?.message || defaultErrorMessage || getErrorMessageDictionary(-1)
    )
  }

  return (
    getErrorMessageDictionary(status) ||
    defaultErrorMessage ||
    getErrorMessageDictionary(-1)
  )
}
