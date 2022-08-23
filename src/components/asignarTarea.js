import './asignarTarea.css'

import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { PropTypes } from 'prop-types'
import React, { Component } from 'react'

import { Tarea } from '../domain/tarea'
import { tareaService } from '../services/tareaService'
import { usuarioService } from '../services/usuarioService'
import { obtenerMensaje } from '../utils/obtenerMensaje'
import { Button, FormLabel, MenuItem, Select, Snackbar, TextField } from '@mui/material'
import { withRouter } from '../utils/withRouter'
import { withParams } from '../utils/withParams'

class AsignarTareaComponent extends Component {

  state = {
    usuarios: [],
    tarea: new Tarea()
  }

  async componentDidMount() {
    try {
      const usuarios = await usuarioService.allInstances()
      const { id } = this.props.params
      const tarea = await tareaService.getTareaById(id)
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
    this.props.navigate('/')
  }

  render() {
    const { tarea, usuarios, errorMessage } = this.state
    const snackbarOpen = !!errorMessage // O se puede usar Boolean(errorMessage)
    return (
      <div class="form">
        <Card>
          <CardContent>
            <Typography variant="h5" component="h1">
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
              /* Acá podemos ver cómo esta declarado nombreAsignatario */
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
            <Button variant="contained" color="warning" onClick={this.aceptarCambios}>
              Aceptar
            </Button>
            <Button variant="outlined" color="warning" onClick={this.volver}>
              Cancelar
            </Button>
          </CardActions>
          <Snackbar
            open={snackbarOpen}
            message={errorMessage}
            autoHideDuration={4}
          />
        </Card>
      </div>
    )
  }

  static get propTypes() {
    return {
      history: PropTypes.object,
      match: PropTypes.object,
    }
  }
}

export default withParams(withRouter(AsignarTareaComponent))