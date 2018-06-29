import React, { Component } from 'react'
import { TareaService } from '../services/tareaService'
import { Tarea } from '../domain/tarea'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import AccountBoxIcon from '@material-ui/icons/AccountBox'
import { Tooltip } from '@material-ui/core'
import { withRouter } from 'react-router-dom'

const tareaService = new TareaService()

export class TareasComponent extends Component {

    constructor(props) {
        super(props)
        tareaService.allInstances()
            .then((res) => res.json())
            .then((tareasJson) => {
                this.setState({
                    tareas: tareasJson.map((tareaJson) => Tarea.fromJson(tareaJson))
                })
            })
            .catch(this.errorHandler)
    }


    errorHandler(errorMessage) {
        throw errorMessage
    }

    render() {
        const tareas = this.state ? this.state.tareas : []
        return (
            <Paper>
                <br />
                <h1>Tareas a realizar
                </h1>
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
                    <TableBody>
                        {tareas.map((tarea) => <TareaRow tarea={tarea} key={tarea.id} history={this.props.history} />)}
                    </TableBody>
                </Table>
            </Paper>
        )
    }
}

export class TareaRow extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tarea: this.props.tarea
        }
    }

    cumplirTarea(tarea) {
        tarea.cumplir()
        tareaService.actualizarTarea(tarea).then(
            () => this.setState({
                tarea: tarea
            })
        )
    }

    render() {
        const tarea = this.state.tarea
        let cumplirButton = ""
        if (tarea.sePuedeCumplir()) {
            cumplirButton = 
            <Tooltip id="tooltip-fab" title="Cumplir tarea">
                <IconButton aria-label="Cumplir" onClick={(event) => this.cumplirTarea(tarea)}>
                    <CheckCircleIcon />
                </IconButton>
            </Tooltip>
        }
        let asignarButton = ""
        if (tarea.sePuedeAsignar()) {
            asignarButton =
            <Tooltip id="tooltip-asignar" title="Asignar persona a tarea">
                <IconButton aria-label="Asignar" onClick={() => this.props.history.push('/asignarTarea/' + tarea.id)}>
                    <AccountBoxIcon />
                </IconButton>
            </Tooltip>
        }

        return (
            <TableRow key={tarea.id}>
                <TableCell component="th" scope="row">
                    {tarea.descripcion}
                </TableCell>
                <TableCell>{tarea.fecha}</TableCell>
                <TableCell>{tarea.asignatario ? tarea.asignatario.nombre : ''}</TableCell>
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
}

class PorcentajeCumplimiento extends Component {

    get backgroundColor() {
        if (this.props.porcentaje > 80) return 'green'
        if (this.props.porcentaje < 50) return 'darkred'
        return 'gold'
    }

    render() {
        if (!this.props.porcentaje) return null
        return (
            <Avatar style={{ backgroundColor: this.backgroundColor, fontSize: '0.7rem' }}>{this.props.porcentaje || 0}%</Avatar>
        )
    }
}

export default withRouter(TareasComponent)