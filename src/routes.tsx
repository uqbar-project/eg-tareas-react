import { type Dispatch, type SetStateAction, useState } from 'react'
import {
  Link,
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom'
import { tareaService } from '@/services/tareaService'
import { getMensajeError } from '@/utils/errorHandling'
import { AsignarTareaComponent } from './components/asignarTarea/asignarTarea'
import { Toast } from './components/common/toast'
import { CrearTareaComponent } from './components/crearTarea/crearTarea'
import { EliminarTareaComponent } from './components/eliminarTarea/eliminarTarea'
import { TareasComponent } from './components/tareas/tareas'
import { useOnInit } from './customHooks/hooks'
import { showToast, useToast } from './customHooks/useToast'
import type { Tarea } from './domain/tarea'

export type PaginadorContextType = {
  tareas: Tarea[]
  setTareas: Dispatch<SetStateAction<Tarea[]>>
  hasMore: boolean
  traerTareas: () => Promise<void>
  actualizarTarea: (tarea: Tarea) => Promise<Tarea[]>
  agregarTarea: (tarea: Tarea) => Promise<Tarea[]>
  eliminarTarea: (id: number) => Promise<Tarea[]>
}

const pageSize = 10

export const PaginadorLayout = () => {
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(0)
  const { toast } = useToast()

  const getTareas = async (newPage: number) => {
    try {
      const { tareas, hasMore } = await tareaService.getTareas({
        page: newPage,
        limit: pageSize,
      })
      setHasMore(hasMore)
      setTareas((oldTareas) => oldTareas.concat(tareas))
    } catch (error: unknown) {
      const errorMessage = getMensajeError(error)
      showToast(errorMessage, 'error')
    }
  }

  const traerTareas = async () => {
    const newPage = page + 1
    getTareas(newPage)
    setPage(newPage)
  }

  const actualizarTarea = async (tareaActualizada: Tarea) => {
    const nuevasTareas = [...tareas]
    const indexTarea = nuevasTareas.findIndex(
      (tareaSearch: Tarea) => tareaSearch.id === tareaActualizada.id
    )
    if (indexTarea < 0) {
      showToast('Tarea no encontrada. Recargue la página.', 'error')
      return
    }
    nuevasTareas[indexTarea] = tareaActualizada
    setTareas(nuevasTareas)
  }

  const agregarTarea = async (nuevaTarea: Tarea) => {
    setTareas((oldTareas) => [nuevaTarea, ...oldTareas])
  }

  const eliminarTarea = async (id: number) => {
    setTareas((oldTareas) => oldTareas.filter((t) => t.id !== id))
  }

  useOnInit(traerTareas)

  return (
    <div className="layout">
      <header className="header">
        <Link to="/" className="headerLink" style={{ fontWeight: 700 }}>
          Tareas
        </Link>
        <Link to="/" className="headerLink">
          Inicio
        </Link>
      </header>
      <div className="main">
        <Outlet
          context={{
            tareas,
            setTareas,
            hasMore,
            traerTareas,
            actualizarTarea,
            agregarTarea,
            eliminarTarea,
          }}
        />
      </div>
      <div className="toast-container">
        <Toast toast={toast} />
      </div>
    </div>
  )
}

export const TareasRoutes = () => (
  <Routes>
    <Route path="/" element={<PaginadorLayout />}>
      <Route path="/" element={<TareasComponent />} />
      <Route path="/asignarTarea/:id" element={<AsignarTareaComponent />} />
      <Route path="/crearTarea" element={<CrearTareaComponent />} />
      <Route path="/eliminarTarea/:id" element={<EliminarTareaComponent />} />
    </Route>
  </Routes>
)

export const TareasRouter = () => (
  <Router>
    <TareasRoutes />
  </Router>
)
