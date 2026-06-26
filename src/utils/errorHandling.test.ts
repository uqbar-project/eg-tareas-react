import { AxiosError, type AxiosResponse } from 'axios'
import { describe, expect, test } from 'vitest'
import { getMensajeError } from './errorHandling'

describe('error handling tests', () => {
  test('should return error message for TS Errors', () => {
    const error = new Error('test error')
    const errorMessage = getMensajeError(error)
    expect(errorMessage).toBe('test error')
  })

  test('should return error message for Axios errors (4xx)', () => {
    const error = new AxiosError(
      'Missing or invalid phone number',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        status: 400,
        data: {
          message: 'Missing or invalid phone number',
        },
      } as unknown as AxiosResponse
    )
    error.status = 400
    const errorMessage = getMensajeError(error)
    expect(errorMessage).toBe('Missing or invalid phone number')
  })

  test('should return error message for Axios errors (5xx)', () => {
    const error = new AxiosError(
      'Index out of bounds',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      {
        status: 500,
        data: {
          message: 'Index out of bounds',
        },
      } as unknown as AxiosResponse
    )
    error.status = 500
    const errorMessage = getMensajeError(error)
    expect(errorMessage).toBe(
      'Ocurrió un error al conectarse al backend. Consulte al administrador del sistema'
    )
  })

  test('should handle non-Error objects', () => {
    const errorMessage = getMensajeError('some string error')
    expect(errorMessage).toBe(
      'Ocurrió un error. Consulte al administrador del sistema'
    )
  })

  test('should return default message for AxiosError without response', () => {
    const error = new AxiosError('Error', 'ERR_BAD_REQUEST')
    const errorMessage = getMensajeError(error)
    expect(errorMessage).toBe(
      'Ocurrió un error al conectarse al backend. Consulte al administrador del sistema'
    )
  })

  test('should return error message for 4xx without backend message', () => {
    const error = new AxiosError(
      'Custom error message',
      'ERR_BAD_REQUEST',
      undefined,
      undefined,
      { status: 400, data: {} } as unknown as AxiosResponse
    )
    error.status = 400
    const errorMessage = getMensajeError(error)
    expect(errorMessage).toBe('Custom error message')
  })
})
