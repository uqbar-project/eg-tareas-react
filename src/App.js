import './App.css'

import React from 'react'

import { TareasRouter } from './routes'
import { createTheme } from '@mui/material'
import { ThemeProvider } from '@emotion/react'

const theme = createTheme({
  typography: {
    fontFamily: [
      "Inter",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "sans-serif"
    ].join(",")
  }
})

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <TareasRouter />
      </div>
    </ThemeProvider>
  )
}

export default App
