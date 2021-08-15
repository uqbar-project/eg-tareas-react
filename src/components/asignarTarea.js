import './asignarTarea.css'

import { Button, FormLabel, MenuItem, Select, Snackbar, TextField } from '@material-ui/core'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import { PropTypes } from 'prop-types'
import React, { Component } from 'react'

import { Tarea } from '../domain/tarea'
import { tareaService } from '../services/tareaService'
import { usuarioService } from '../services/usuarioService'
import { obtenerMensaje } from '../utils/obtenerMensaje'

export default class AsignarTareaComponent extends Component {

  state = {
    usuarios: [],
    tarea: new Tarea()
  }

  async componentDidMount() {
    try {
      const usuarios = await usuarioService.allInstances()
      const tarea = await tareaService.getTareaById(this.props.match.params.id)
      this.setState({
        usuarios,
        tarea,
      })
    } catch (e) {
      this.generarError(e)
    }
  }

  cambiarEstado = (tarea) => {
    const newTarea = Object.assign(tarea)
    this.setState({
      tarea: newTarea,
      errorMessage: '',
    })
  }

  generarError = (error) => {
    this.setState({ errorMessage: obtenerMensaje(error) })
  }

  asignar = (asignatario) => {
    const tarea = this.state.tarea
    const asignatarioNuevo = asignatario.trim() ? asignatario : null
    tarea.asignarA(asignatarioNuevo)
    this.cambiarEstado(tarea)
  }

  cambiarDescripcion = (event) => {
    const tarea = this.state.tarea
    tarea.descripcion = event.target.value
    this.cambiarEstado(tarea)
  }

  aceptarCambios = async () => {
    try {
      this.state.tarea.validarAsignacion()
      await tareaService.actualizarTarea(this.state.tarea)
      this.volver()
    } catch (e) {
      this.generarError(e)
    }
  }

  volver = () => {
    this.props.history.push('/')
  }

  render() {
    const { tarea, usuarios, errorMessage } = this.state
    const snackbarOpen = !!errorMessage // O se puede usar Boolean(errorMessage)
    return (
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2">
            Asignar tarea
        </Typography>
        </CardContent>
        <CardContent className="linea">
          <FormLabel>Descripción:</FormLabel>
        </CardContent>
        <CardContent>
          <TextField inputProps={{"data-testid":"descripcion"}} id="descripcion" value={tarea.descripcion} onChange={this.cambiarDescripcion} className="formControl" />
        </CardContent>
        <CardContent className="linea">
          <FormLabel>Asignatario:</FormLabel>
        </CardContent>
        <CardContent>
          <Select
            /*Aca podemos ver cómo esta declarado nombreAsignatario */
            value={tarea.nombreAsignatario || ' '}
            onChange={(event) => this.asignar(event.target.value)}
            className="formControl"
            inputProps={{
              name: 'asignatario',
              id: 'asignatario'
            }}
          >
            <MenuItem value=" ">
              <em>Sin Asignar</em>
            </MenuItem>
            {usuarios.map(usuario => <MenuItem value={usuario.nombre} key={usuario.nombre}>{usuario.nombre}</MenuItem>)}
          </Select>
        </CardContent>
        <CardActions className="botonera">
          <CardContent>
            <Button variant="contained" color="primary" onClick={this.aceptarCambios}>
              Aceptar
            </Button>
          </CardContent>
          <CardContent>
            <Button variant="contained" onClick={this.volver}>
              Cancelar
        </Button>
          </CardContent>
        </CardActions>
        <Snackbar
          open={snackbarOpen}
          message={errorMessage}
          autoHideDuration={4}
        />
      </Card>
    )
  }

  static get propTypes() {
    return {
      history: PropTypes.object,
      match: PropTypes.object,
    }
  }
}