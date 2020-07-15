import React, { useState, useEffect, useCallback } from "react"
import { tareaService } from "../../services/tareaService"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Paper from "@material-ui/core/Paper"
import TareaRow from "./tareaRow/tareaRow"
import PropTypes from "prop-types"

export function TareasComponent() {
  const [tareas, setTareas] = useState([])

  const actualizarTareas = useCallback(async () => {
    try {
      const tareas = await tareaService.allInstances()
      setTareas(tareas)
    } catch (error) {
      errorHandler(error)
    }
  }, [])

  useEffect(() => {
    actualizarTareas()
  }, [actualizarTareas])

  const errorHandler = (errorMessage) => {
    throw errorMessage
  }

  return (
    <Paper>
      <br />
      <h1>Tareas a realizar</h1>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Tarea</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Asignatario</TableCell>
            <TableCell>% Cumplimiento</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody id="resultados">
          {tareas.map((tarea) => (
            <TareaRow
              tarea={tarea}
              key={tarea.id}
              data-testid={`tarea_${tarea.id}`}
              actualizarTareas={actualizarTareas}
            />
          ))}
        </TableBody>
      </Table>
    </Paper>
  )
}

TareasComponent.propTypes = {
  history: PropTypes.object,
}
