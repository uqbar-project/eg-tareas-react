import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import './App.css'
import { TareasRoutes } from './routes'

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <TareasRoutes />
      </div>
    </BrowserRouter>
  )
}

export default App
