import React from 'react'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import IconButton from '@material-ui/core/IconButton'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import AccountBoxIcon from '@material-ui/icons/AccountBox'
import { Tooltip } from '@material-ui/core'
import PropTypes from 'prop-types'
import { PorcentajeCumplimiento } from './porcentajeCumplimiento'
import { withRouter } from 'react-router-dom'
import { Tarea } from '../../domain/tarea'

function TareaRow(props) {
    const { tarea } = props

    const cumplirTarea = async () => {
        tarea.cumplir()
        try {
            await props.tareaService.actualizarTarea(tarea)
            props.actualizar()
        } catch (error) {
            console.log(error)
        }
    }

    const goToAsignarTarea = () => {
        props.history.push(`/asignarTarea/${tarea.id}`)
    }

    const cumplirButton = tarea.sePuedeCumplir() &&
        <Tooltip id="tooltip-fab" title="Cumplir tarea">
            <IconButton id={'cumplir_' + tarea.id} aria-label="Cumplir" onClick={cumplirTarea}>
                <CheckCircleIcon />
            </IconButton>
        </Tooltip>

    const asignarButton = tarea.sePuedeAsignar() &&
        <Tooltip id="tooltip-asignar" title="Asignar persona a tarea">
            <IconButton aria-label="Asignar" onClick={goToAsignarTarea}>
                <AccountBoxIcon />
            </IconButton>
        </Tooltip>

    return (
        <TableRow key={tarea.id} id={'TableRow' + tarea.id}>
            <TableCell component="th" scope="row">
                {tarea.descripcion}
            </TableCell>
            <TableCell>{tarea.fecha}</TableCell>
            <TableCell>{tarea.nombreAsignatario}</TableCell>
            <TableCell>
                <PorcentajeCumplimiento porcentaje={tarea.porcentajeCumplimiento || 0} />
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
    tareaService: PropTypes.object,
    actualizar: PropTypes.func
}


export default withRouter(TareaRow)