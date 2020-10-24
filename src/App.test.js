import { render } from '@testing-library/react'
import React from 'react'

import App from './App'

test('app levanta ok', () => {
  const { getByText } = render(<App />)
  expect(getByText(/Tareas/i)).toBeInTheDocument()
})
