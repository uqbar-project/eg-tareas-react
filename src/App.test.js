import { render, screen } from '@testing-library/react'
import React from 'react'

import App from './App'

test('app levanta ok', () => {
  render(<App />)
  expect(screen.getByText(/Tareas/i)).toBeInTheDocument()
})
