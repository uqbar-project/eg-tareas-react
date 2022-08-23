import './App.css'

import React, { Component } from 'react'

import { TareasRoutes } from './routes'
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

class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <div className="App">
          <TareasRoutes />
        </div>
      </ThemeProvider>
    )
  }
}

export default App
