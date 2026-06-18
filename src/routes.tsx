import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useState,
} from 'react'
import {
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom'
import { tareaService } from 'src/services/tareaService'
import { type ErrorResponse, getMensajeError } from 'src/utils/errorHandling'
import { AsignarTareaComponent } from './components/asignarTarea/asignarTarea'
import { Toast } from './components/common/toast'
import { TareasComponent } from './components/tareas/tareas'
import { useOnInit } from './customHooks/hooks'
import { useToast } from './customHooks/useToast'
import type { Tarea } from './domain/tarea'

export type PaginadorContextType = {
  tareas: Tarea[]
  setTareas: Dispatch<SetStateAction<Tarea[]>>
  hasMore: boolean
  traerMasTareas: () => Promise<Tarea[]>
  actualizarTarea: (tarea: Tarea) => Promise<Tarea[]>
}

const pageSize = 10

export const PaginadorLayout = () => {
  const [tareas, setTareas] = useState<Tarea[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [page, setPage] = useState(1)
  const { toast, showToast } = useToast()

  const getTareas = useCallback(
    async (newPage: number, init = false) => {
      try {
        const { tareas, hasMore } = await tareaService.getTareas({
          page: newPage,
          limit: pageSize,
        })
        setHasMore(hasMore)
        setTareas((oldTareas) => (init ? [] : oldTareas).concat(tareas))
      } catch (error: unknown) {
        const errorMessage = getMensajeError(error as ErrorResponse)
        showToast(errorMessage, 'error')
      }
    },
    [showToast]
  )

  const traerMasTareas = async () => {
    const newPage = page + 1
    getTareas(newPage)
    setPage(newPage)
  }

  const traerTareas = useCallback(async () => {
    getTareas(page, true)
  }, [page, getTareas])

  const actualizarTarea = async (tareaActualizada: Tarea) => {
    const nuevasTareas = [...tareas]
    const indexTarea = nuevasTareas.findIndex(
      (tareaSearch: Tarea) => tareaSearch.id === tareaActualizada.id
    )
    nuevasTareas[indexTarea] = tareaActualizada
    setTareas(nuevasTareas)
  }

  useOnInit(traerTareas)

  return (
    <>
      <Outlet
        context={{
          tareas,
          setTareas,
          hasMore,
          traerMasTareas,
          actualizarTarea,
        }}
      />
      <div id="toast-container">
        <Toast toast={toast} />
      </div>
    </>
  )
}

export const TareasRoutes = () => (
  <Routes>
    <Route path="/" element={<PaginadorLayout />}>
      <Route path="/" element={<TareasComponent />} />
      <Route path="/asignarTarea/:id" element={<AsignarTareaComponent />} />
    </Route>
  </Routes>
)

export const TareasRouter = () => (
  <Router>
    <TareasRoutes />
  </Router>
)
