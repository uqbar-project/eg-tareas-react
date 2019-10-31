import React, { Component } from 'react'
import { Paper, TextField, Select, MenuItem, FormLabel, Button, Snackbar } from '@material-ui/core'
import { TareaService } from '../services/tareaService'
import { UsuarioService } from '../services/usuarioService'
import { Tarea } from '../domain/tarea'
import { PropTypes } from 'prop-types'


export default class AsignarTareaComponent extends Component {

  state = {
    usuarios: [],
    tarea: new Tarea()
  }

  async componentDidMount() {
    try {
      const usuarios = await UsuarioService.allInstances()
      const tarea = await TareaService.getTareaById(this.props.match.params.id)
      this.setState({
        usuarios: usuarios,
        tarea: tarea
      })
    } catch (e) {
      this.generarError(e)
    }
  }

  asignarTarea = async () => {
    try {
      this.state.tarea.validarAsignacion()
      await TareaService.actualizarTarea(this.state.tarea)
      this.volver()
    } catch (e) {
      this.generarError(e)
    }
  }

  cambiarEstado = (closureChange) => {
    const tarea = this.state.tarea
    closureChange(tarea)
    this.setState({
      tarea,
      errorMessage: ''
    })
  }

  generarError = (errorMessage) => {
    this.setState({
      errorMessage: errorMessage.toString()
    })
  }

  asignar = (asignatario) => {
    this.cambiarEstado((tarea) => tarea.asignarA(asignatario))
  }

  cambiarDescripcion = (event) => {
    const valor = event.target.value
    this.cambiarEstado((tarea) => tarea.descripcion = valor)
  }

  volver = () => {
    this.props.history.push('/')
  }

  render() {
    const { tarea, usuarios, errorMessage } = this.state
    const snackbarOpen = !!errorMessage // O se puede usar Boolean(errorMessage)
    return (
      <Paper>
        <br />
        <h2>Asignar tarea</h2>
        <br />
        <FormLabel>Descripción</FormLabel>
        <br /><br />
        <TextField id="descripcion" value={tarea.descripcion} onChange={this.cambiarDescripcion} fullWidth />
        <br />
        <br /><br />
        <br /><br />
        <FormLabel>Asignatario</FormLabel>
        <br /><br />
        <Select
          /*Aca podemos ver como esta declarado nombreAsignatario */
          value={tarea.nombreAsignatario}
          onChange={(event) => this.asignar(event.target.value)}
          className="formControl"
          inputProps={{
            name: 'asignatario',
            id: 'asignatario'
          }}
        >
          &gt;
              <MenuItem value=" ">
            <em>Sin Asignar</em>
          </MenuItem>
          {usuarios.map(usuario => <MenuItem value={usuario.nombre} key={usuario.id}>{usuario.nombre}</MenuItem>)}
        </Select>
        <br />
        <br />
        <br />
        <Button variant="contained" color="primary" onClick={this.asignarTarea}>
          Aceptar
        </Button>
        &nbsp;&nbsp;&nbsp;
        <Button variant="contained" onClick={this.volver}>
          Cancelar
        </Button>
        <br />
        <br />
        <Snackbar
          open={snackbarOpen}
          message={errorMessage}
          autoHideDuration={4}
        />
      </Paper>
    )
  }

  static get propTypes() {
    return {
      history: PropTypes.object,
      match: PropTypes.object,
    }
  }
}