import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { AsignarTareaComponent } from './components/asignarTarea'
import { TareasComponent } from './components/tareas/tareas'

export const TareasRoutes = () => 
    <Router>
        <Routes>
            <Route exact={true} path="/" element={<TareasComponent/>} />
            <Route path="/asignarTarea/:id" element={<AsignarTareaComponent/>} />
        </Routes>
    </Router>

