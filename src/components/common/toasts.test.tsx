import { describe, expect, test } from 'vitest'
import { Toast } from './toast'
import { ToastMessage } from 'src/customHooks/useToast'
import { render, screen } from '@testing-library/react'

describe('toast tests', () => {
  test('should render toast', () => {
    const toast = {
      message: 'test toast',
      type: 'success' as ToastMessage['type'],
      duration: 4000,
    }
    render(<Toast toast={toast} />)
    expect(screen.getByTestId('toast').innerHTML).toBe('test toast')
  })
})