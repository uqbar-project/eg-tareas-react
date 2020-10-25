import './App.css'

import React, { Component } from 'react'
import { BrowserRouter } from 'react-router-dom'

import { TareasRoutes } from './routes'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <TareasRoutes />
        </div>
      </BrowserRouter>
    )
  }
}

export default App
