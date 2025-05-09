// SPDX-License-Identifier: MPL-2.0
// Copyright (C) 2018 - 2021 Gemeente Amsterdam
import 'jest-localstorage-mock'
import { call } from 'redux-saga/effects'

import { getAuthHeaders } from 'shared/services/auth/auth'
import request from 'utils/request'

import {
  authCall,
  authCallWithPayload,
  authDeleteCall,
  authPatchCall,
  authPostCall,
  errorMessageDictionary,
  generateParams,
  postCall,
  getErrorMessage,
} from './api'

jest.mock('shared/services/auth/auth', () => ({
  getAuthHeaders: jest.fn(),
}))

describe('api service', () => {
  let params
  const queryString = 'name1=value1&name2=value2&value3=foo&value3=bar'
  const url = 'https://url/to/test'
  const token = 'bearer-token'

  beforeEach(() => {
    params = {
      name1: 'value1',
      name2: 'value2',
      value3: ['foo', 'bar'],
    }
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('generateParams', () => {
    it('should create the correct params from object', () => {
      const result = generateParams(params)
      expect(result).toEqual(queryString)
    })
  })

  describe('authCall', () => {
    it('should generate the right call', () => {
      getAuthHeaders.mockImplementation(() => ({
        Authorization: `Bearer ${token}`,
      }))

      const fullUrl = `${url}?${queryString}`
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }

      const gen = authCall(url, params)
      expect(gen.next(token).value).toEqual(call(request, fullUrl, options))
    })

    it('should generate a call without token if it is not present', () => {
      getAuthHeaders.mockImplementation(() => null)

      const fullUrl = `${url}?${queryString}`
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
      }
      const gen = authCall(url, params)
      expect(gen.next().value).toEqual(call(request, fullUrl, options)) // eslint-disable-line redux-saga/yield-effects
    })

    it('should generate the right call when params are not defined', () => {
      getAuthHeaders.mockImplementation(() => ({
        Authorization: `Bearer ${token}`,
      }))

      const fullUrl = `${url}`
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
      const gen = authCall(url, undefined)
      expect(gen.next(token).value).toEqual(call(request, fullUrl, options))
    })

    it('should generate the right call with a custom token', () => {
      const fullUrl = `${url}?${queryString}`
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer custom-token',
        },
      }
      const gen = authCall(url, params, 'custom-token')
      expect(gen.next(token).value).toEqual(call(request, fullUrl, options))
    })
  })

  describe('authCallWithPayload', () => {
    it('should generate the right call', () => {
      getAuthHeaders.mockImplementation(() => ({
        Authorization: `Bearer ${token}`,
      }))
      const options = {
        method: 'METHOD',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(params),
      }
      const gen = authCallWithPayload(url, params, 'METHOD')
      expect(gen.next(token).value).toEqual(call(request, url, options))
    })

    it('should generate a call without token if it is not present', () => {
      getAuthHeaders.mockImplementation(() => null)
      const options = {
        method: 'METHOD',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      }
      const gen = authCallWithPayload(url, params, 'METHOD')
      expect(gen.next().value).toEqual(call(request, url, options))
    })
  })

  describe('authPostCall', () => {
    it('should generate the right call', () => {
      const gen = authPostCall(url, params)
      expect(gen.next(token).value).toEqual(
        call(authCallWithPayload, url, params, 'POST')
      )
    })
  })

  describe('authPatchCall', () => {
    it('should generate the right call', () => {
      const gen = authPatchCall(url, params)
      expect(gen.next(token).value).toEqual(
        call(authCallWithPayload, url, params, 'PATCH')
      )
    })
  })

  describe('authDeleteCall', () => {
    it('should generate the right call', () => {
      const gen = authDeleteCall(url, params)
      expect(gen.next(token).value).toEqual(
        call(authCallWithPayload, url, params, 'DELETE')
      )
    })
  })

  describe('postCall', () => {
    it('should generate the right call', () => {
      const postBody = {
        method: 'POST',
        body: JSON.stringify({ ...params }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const gen = postCall(url, params)
      expect(gen.next(token).value).toEqual(call(request, url, postBody))
    })
  })
})
