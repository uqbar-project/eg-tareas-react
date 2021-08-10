import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import AsignarTareaComponent from './components/asignarTarea'
import { TareasComponent } from './components/tareas/tareas'

export const TareasRoutes = () => 
    <Router>
        <Route exact={true} path="/" component={TareasComponent} />
        <Route path="/asignarTarea/:id" component={AsignarTareaComponent} />
    </Router>

