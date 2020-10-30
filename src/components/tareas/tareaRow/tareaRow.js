import { Tooltip } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import AccountBoxIcon from '@material-ui/icons/AccountBox'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import { PropTypes } from 'prop-types'
import React from 'react'
import { withRouter } from 'react-router-dom'

import { Tarea } from '../../../domain/tarea'
import { tareaService } from '../../../services/tareaService'
import { PorcentajeCumplimiento } from '../../porcentajeCumplimiento/porcentajeCumplimiento'

export const TareaRow = (props) => {
    const { tarea } = props

    const cumplirTarea = async () => {
        tarea.cumplir()
        // debugger // para mostrar que no se cambia la ui despues de hacer tarea.cumplir()
        try {
            await tareaService.actualizarTarea(tarea)
            props.actualizar()
        } catch (error) {
            this.generarError(error)
        }
    }

    const goToAsignarTarea = () => {
        props.history.push(`/asignarTarea/${tarea.id}`)
    }

    const cumplirButton = tarea.sePuedeCumplir() &&
        <Tooltip data-testid="tooltip-fab" title="Cumplir tarea">
            <IconButton data-testid={`cumplir_${tarea.id}`} aria-label="Cumplir" onClick={cumplirTarea}>
                <CheckCircleIcon />
            </IconButton>
        </Tooltip>

    const asignarButton = tarea.sePuedeAsignar() &&
        <Tooltip data-testid="tooltip-asignar" title="Asignar persona a tarea">
            <IconButton aria-label="Asignar" onClick={goToAsignarTarea} data-testid={`asignar_${tarea.id}`}>
                <AccountBoxIcon />
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
        </TableRow>
    )
}

TareaRow.propTypes = {
    tarea: PropTypes.instanceOf(Tarea),
    history: PropTypes.object,
    actualizar: PropTypes.func,
}

export default withRouter(TareaRow)
