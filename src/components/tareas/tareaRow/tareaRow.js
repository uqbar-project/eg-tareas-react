import { useNavigate } from 'react-router-dom'
import Snackbar from '@mui/material/Snackbar'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { PropTypes } from 'prop-types'
import React, { useState } from 'react'

import { Tarea } from '../../../domain/tarea'
import { tareaService } from '../../../services/tareaService'
import { obtenerMensaje } from '../../../utils/obtenerMensaje'
import { PorcentajeCumplimiento } from '../../porcentajeCumplimiento/porcentajeCumplimiento'

export const TareaRow = ({ tarea, actualizar }) => {
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const cumplirTarea = async () => {
    // debugger // para mostrar que no se cambia la ui despues de hacer tarea.cumplir()
    try {
      tarea.cumplir()
      await tareaService.actualizarTarea(tarea)
    } catch (error) {
      generarError(error)
    } finally {
      // viene como props
      await actualizar()
    }
  }

  const generarError = (error) => {
    const mensaje = obtenerMensaje(error)
    setErrorMessage(mensaje)
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
      <TableCell>{tarea.fecha}</TableCell>
      <TableCell>{tarea.nombreAsignatario}</TableCell>
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

TareaRow.propTypes = {
  tarea: PropTypes.instanceOf(Tarea),
  navigate: PropTypes.func,
  actualizar: PropTypes.func,
}

export default TareaRow
