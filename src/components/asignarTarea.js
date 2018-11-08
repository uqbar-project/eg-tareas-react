import React, { Component } from 'react'
import { Paper, TextField, Select, MenuItem, FormLabel, Button, Snackbar } from '@material-ui/core'
import { TareaService } from '../services/tareaService'
import { UsuarioService } from '../services/usuarioService'
import { Tarea } from '../domain/tarea'

const tareaService = new TareaService()
const usuarioService = new UsuarioService()

export default class AsignarTareaComponent extends Component {

    constructor(props) {
        super(props)
        this.state = {
            usuarios: [],
            tarea: new Tarea()
        }
        this.initialize()
    }

    async initialize() {
        try {
            const response = await usuarioService.allInstances()
            const usuarios = await response.json()
            const tarea = await tareaService.getTareaById(this.props.match.params.id)
            this.setState({
                ...this.state,
                usuarios: usuarios,
                tarea: tarea
            })
        } catch (e) {
            this.generarError(e)
        }
    }

    snackbarOpen() {
        return this.state.errorMessage !== undefined && this.state.errorMessage !== ''
    }

    async asignarTarea() {
        try {
            this.state.tarea.validarAsignacion()
            await tareaService.actualizarTarea(this.state.tarea)
            this.volver()
        } catch (e) {
            this.generarError(e)
        }
    }

    cambiarEstado(closureChange) {
        const tarea = this.state.tarea
        closureChange(tarea)
        this.setState({
            ...this.state,
            tarea: tarea,
            errorMessage: ""
        })
    }

    generarError(errorMessage) {
        console.log(errorMessage)
        console.log("state", this.state)
        this.setState({
            ...this.state,
            errorMessage: errorMessage.toString()
        })
    }

    asignar(asignatario) {
        this.cambiarEstado((tarea) => tarea.asignarA(asignatario))
    }

    cambiarDescripcion(descripcion) {
        this.cambiarEstado((tarea) => tarea.descripcion = descripcion)
    }

    volver() {
        tareaService.allInstances().then((res) => res.json()).then(
            (tareas) => this.props.history.push('/', { tareas: tareas })
        )
    }

    render() {
        if (!this.state.tarea.descripcion) return null
        return (
            <Paper>
                <br />
                <h2>Asignar tarea</h2>
                <br />
                <FormLabel>Descripción</FormLabel>
                <br /><br />
                <TextField id="descripcion" value={this.state.tarea.descripcion} onChange={(event) => this.cambiarDescripcion(event.target.value)} />
                <br />
                <br /><br />
                <br /><br />
                <FormLabel>Asignatario</FormLabel>
                <br /><br />
                <Select
                    value={this.state.tarea.nombreAsignatario()}
                    onChange={(event) => this.asignar(event.target.value)}
                    className="formControl"
                    inputProps={{
                        name: 'asignatario',
                        id: 'asignatario'
                    }}
                >
                    >
                        <MenuItem value=" ">
                        <em>Sin Asignar</em>
                    </MenuItem>
                    {this.state.usuarios.map(usr => <MenuItem value={usr.nombre} key={usr.id}>{usr.nombre}</MenuItem>)}
                </Select>
                <br />
                <br />
                <br />
                <Button variant="contained" color="primary" onClick={() => this.asignarTarea()}>
                    Aceptar
                </Button>
                &nbsp;&nbsp;&nbsp;
                <Button variant="contained" onClick={() => this.volver()}>
                    Cancelar
                </Button>
                <br />
                <br />
                <Snackbar
                    open={this.snackbarOpen()}
                    message={this.state.errorMessage}
                    autoHideDuration={5000}
                />
            </Paper>
        )
    }

}