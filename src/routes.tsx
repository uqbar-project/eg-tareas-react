import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AsignarTareaComponent } from './components/asignarTarea/asignarTarea'
import { TareasComponent } from './components/tareas/tareas'

export const TareasRoutes = () => 
    <Routes>
        <Route path="/" element={<TareasComponent/>} />
        <Route path="/asignarTarea/:id" element={<AsignarTareaComponent/>} />
    </Routes>

export const TareasRouter = () => 
    <Router>
        <TareasRoutes/>
    </Router>

