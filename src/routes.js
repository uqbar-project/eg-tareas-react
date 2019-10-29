import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { TareasComponent } from './components/tareas/tareas'
import AsignarTareaComponent from './components/asignarTarea'

export const TareasRoutes = () => (
    <Router>
        <Route exact={true} path="/" component={TareasComponent} />
        <Route path="/asignarTarea/:id" component={AsignarTareaComponent} />
    </Router>
)
