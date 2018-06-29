import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { TareasComponent } from './components/tareas'
import AsignarTareaComponent from './components/asignarTarea'

export const TareasRoutes = () => (
    <Router>
        <Switch>
            <Route exact path="/" component={TareasComponent} />
            <Route path="/asignarTarea/:id" component={AsignarTareaComponent} />
        </Switch>
    </Router>
)
