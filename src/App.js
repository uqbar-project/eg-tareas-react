import './App.css'

import React, { Component } from 'react'

import { TareasRoutes } from './routes'

class App extends Component {
  render() {
    return (
      <div className="App">
        <TareasRoutes />
      </div>
    )
  }
}

export default App
