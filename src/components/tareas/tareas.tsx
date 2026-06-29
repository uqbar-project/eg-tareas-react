import './tareas.css'

import React from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import type { PaginadorContextType } from '@/routes'

const TareaRow = React.lazy(() => import('./tareaRow/tareaRow'))

export const TareasComponent = () => {
  const navigate = useNavigate()
  const { tareas, hasMore, traerMasTareas, actualizarTarea } =
    useOutletContext<PaginadorContextType>()

  const goToCrearTarea = () => {
    navigate('/crearTarea')
  }

  return (
    <div className="container">
      <br />
      <h2 className="title">Tareas a realizar</h2>
      <div className="nuevaTareaWrapper">
        <button
          type="button"
          className="primary"
          data-testid="nueva_tarea"
          onClick={goToCrearTarea}
          aria-label="Crear nueva tarea"
        >
          Nueva tarea
        </button>
      </div>
      <table aria-label="Lista de tareas a realizar">
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
            {tareas.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    textAlign: 'center',
                    padding: '3rem 1rem',
                    color: 'var(--color-text-disabled)',
                  }}
                >
                  No hay tareas. Creá una nueva para empezar.
                </td>
              </tr>
            ) : (
              tareas.map((tarea) => (
                <TareaRow
                  tarea={tarea}
                  key={tarea.id}
                  actualizar={actualizarTarea}
                />
              ))
            )}
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
