import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import type { ToastMessage } from '@/customHooks/useToast'
import { Toast } from './toast'

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
