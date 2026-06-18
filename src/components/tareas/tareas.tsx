import './tareas.css'

import React from 'react'
import { useOutletContext } from 'react-router-dom'
import type { PaginadorContextType } from 'src/routes'

const TareaRow = React.lazy(() => import('./tareaRow/tareaRow'))

export const TareasComponent = () => {
  const { tareas, hasMore, traerMasTareas, actualizarTarea } =
    useOutletContext<PaginadorContextType>()

  return (
    <div className="container">
      <br />
      <h2 className="title">Tareas a realizar</h2>
      <table aria-label="Lista de tareas a realizar">
        <caption>
          Tabla de tareas con descripción, fecha, asignatario, porcentaje de
          cumplimiento y acciones disponibles
        </caption>
        <thead>
          <tr>
            <th scope="col">Tarea</th>
            <th scope="col" id="fecha">
              Fecha
            </th>
            <th scope="col" id="asignatario">
              Asignatario
            </th>
            <th
              scope="col"
              className="center"
              aria-label="Porcentaje de cumplimiento"
            >
              %
            </th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <React.Suspense
          fallback={
            <tbody>
              <tr>
                <td colSpan={5} data-testid="fallback_tareas">
                  <span aria-live="polite" aria-busy="true">
                    Cargando filas...
                  </span>
                </td>
              </tr>
            </tbody>
          }
        >
          <tbody data-testid="resultados">
            {tareas.map((tarea) => (
              <TareaRow
                tarea={tarea}
                key={tarea.id}
                actualizar={actualizarTarea}
              />
            ))}
          </tbody>
        </React.Suspense>
      </table>
      {hasMore && (
        <div>
          <button
            type="button"
            className="buttonRow secondary"
            data-testid="mas_tareas"
            onClick={traerMasTareas}
            aria-label="Cargar más tareas"
          >
            Ver más tareas
          </button>
        </div>
      )}
    </div>
  )
}
