import { useNavigate } from 'react-router-dom'
import Snackbar from '@mui/material/Snackbar'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useState } from 'react'

import { ErrorResponse, mostrarMensajeError } from 'src/utils/error-handling'
import { tareaService } from 'src/services/tareaService'
import { PorcentajeCumplimiento } from 'src/components/porcentajeCumplimiento/porcentajeCumplimiento'
import { Tarea } from 'src/domain/tarea'

export const TareaRow = ({ tarea, actualizar }: { tarea: Tarea, actualizar: () => void }) => {
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const cumplirTarea = async () => {
    // debugger // para mostrar que no se cambia la ui despues de hacer tarea.cumplir()
    try {
      tarea.cumplir()
      await tareaService.actualizarTarea(tarea)
    } catch (error: unknown) {
      mostrarMensajeError(error as ErrorResponse, setErrorMessage)
    } finally {
      // viene como props
      await actualizar()
    }
  }

  const goToAsignarTarea = () => {
    navigate(`/asignarTarea/${tarea.id}`)
  }

  const cumplirButton = tarea.sePuedeCumplir() &&
    <Tooltip data-testid="tooltip-fab" title="Cumplir tarea">
      <IconButton data-testid={`cumplir_${tarea.id}`} aria-label="Cumplir" onClick={cumplirTarea}>
        <CheckCircleIcon color="success"/>
      </IconButton>
    </Tooltip>

  const asignarButton = tarea.sePuedeAsignar() &&
    <Tooltip data-testid="tooltip-asignar" title="Asignar persona a tarea">
      <IconButton aria-label="Asignar" onClick={goToAsignarTarea} data-testid={`asignar_${tarea.id}`}>
        <AccountBoxIcon color="warning"/>
      </IconButton>
    </Tooltip>

  return (
    <TableRow key={tarea.id} data-testid={'tarea_' + tarea.id}>
      <TableCell component="th" scope="row">
        {tarea.descripcion}
      </TableCell>
      <TableCell id="fecha">{tarea.fecha}</TableCell>
      <TableCell id="asignatario">{tarea.nombreAsignatario}</TableCell>
      <TableCell>
        <PorcentajeCumplimiento porcentaje={tarea.porcentajeCumplimiento} />
      </TableCell>
      <TableCell>
        {cumplirButton}
        {asignarButton}
      </TableCell>
      <Snackbar
        open={!!errorMessage}
        message={errorMessage}
        autoHideDuration={4}
      />
    </TableRow>
  )
}

export default TareaRow
