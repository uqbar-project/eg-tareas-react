import './tareas.css'

import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { PaginadorContextType } from 'src/routes'

const TareaRow = React.lazy(() => import('./tareaRow/tareaRow'))

export const TareasComponent = () => {
  const { tareas, hasMore, traerMasTareas, actualizarTarea } = useOutletContext<PaginadorContextType>()

  return (
    <div className='container'>
      <br />
      <div className="title">Tareas a realizar</div>
      <table aria-label="simple table">
        <thead>
          <tr>
            <th>Tarea</th>
            <th id="fecha">Fecha</th>
            <th id="asignatario">Asignatario</th>
            <th className="center">%</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <React.Suspense fallback={
          <tbody>
            <tr>
              <td colSpan={5} data-testid='fallback_tareas'>Cargando filas...</td>
            </tr>
          </tbody>
          }>
          <tbody data-testid="resultados">
            {
              tareas.map((tarea) =>
                <TareaRow
                  tarea={tarea}
                  key={tarea.id}
                  actualizar={actualizarTarea} />)
            }
          </tbody>
        </React.Suspense>
      </table>
      {hasMore && <div>
        <button className='buttonRow secondary' data-testid="mas_tareas" onClick={traerMasTareas}>Ver más tareas</button>
      </div>}
    </div>
  )
}
