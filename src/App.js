import React, { Component } from 'react'
import './App.css'
import { TareasRoutes } from './routes'
import { BrowserRouter } from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <TareasRoutes/>
        </div>
      </BrowserRouter>
    )
  }
}

export default App
