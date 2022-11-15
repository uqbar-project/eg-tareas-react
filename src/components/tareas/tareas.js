import './tareas.css';

import { TableContainer } from '@mui/material';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow'
import { useEffect, useState } from 'react'

import { tareaService } from '../../services/tareaService'
import { mostrarMensajeError } from '../../utils/error-handling'
import TareaRow from './tareaRow/tareaRow'

export const TareasComponent = (props) => {

  const [tareas, setTareas] = useState([])
  const [errorMessage, setErrorMessage] = useState('')

  const traerTareas = async () => {
    try {
      const tareas = await tareaService.allInstances()
      setTareas(tareas)
    } catch (error) {
      mostrarMensajeError(error, setErrorMessage)
    }
  }

  useEffect(() => {
    traerTareas()
  }, [])

  const snackbarOpen = !!errorMessage

  return (
    <TableContainer component={Paper}>
      <br />
      <h1>Tareas a realizar</h1>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Tarea</TableCell>
            <TableCell>Fecha</TableCell>
            <TableCell>Asignatario</TableCell>
            <TableCell>% Cumplimiento</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody data-testid="resultados">
          {
            tareas.map((tarea) =>
              <TareaRow
                tarea={tarea}
                key={tarea.id}
                actualizar={traerTareas} />)
          }
        </TableBody>
      </Table>
      <Snackbar
        open={snackbarOpen}
        message={errorMessage}
        autoHideDuration={4}
      />
    </TableContainer>
  )
}
