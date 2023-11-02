import './App.css'

import { ThemeProvider } from '@emotion/react'
import { createTheme } from '@mui/material'

import { TareasRouter } from './routes'

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
