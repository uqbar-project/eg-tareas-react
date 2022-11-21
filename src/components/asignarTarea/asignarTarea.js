import './asignarTarea.css'

import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'

import { tareaService } from '../../services/tareaService'
import { usuarioService } from '../../services/usuarioService'
import { Button, FormLabel, MenuItem, Select, Snackbar, TextField } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { Tarea } from '../../domain/tarea'
import { mostrarMensajeError } from '../../utils/error-handling'
  
export const AsignarTareaComponent = () => {

  const [usuarios, setUsuarios] = useState([])
  const [tarea, setTarea] = useState(new Tarea())
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const params = useParams()
  const { id } = params

  useEffect(() => {
    const initUsuarios = async () => {
      const nuevosUsuarios = await usuarioService.allInstances()
      setUsuarios(nuevosUsuarios)
    }

    initUsuarios()
  }, [])
    
  useEffect(() => {
    const initTareas = async () => {
      const nuevaTarea = await tareaService.getTareaById(id)
      setTarea(nuevaTarea)
    }

    initTareas()
  }, [id])

  const asignar = (asignatario) => {
    const asignatarioNuevo = usuarios.find((usuario) => usuario.nombre === asignatario)
    tarea.asignarA(asignatarioNuevo)
    generarNuevaTarea(tarea)
  }

  const generarNuevaTarea = (tarea) => {
    const nuevaTarea = Object.assign(new Tarea(), tarea)
    setTarea(nuevaTarea)
    setErrorMessage('')
  }

  const cambiarDescripcion = (event) => {
    tarea.descripcion = event.target.value
    generarNuevaTarea(tarea)
  }

  const aceptarCambios = async () => {
    try {
      tarea.validarAsignacion()
      await tareaService.actualizarTarea(tarea)
      volver()
    } catch (error) {
      mostrarMensajeError(error, setErrorMessage)
    }
  }

  const volver = () => {
    navigate('/')
  }

  const snackbarOpen = !!errorMessage // O se puede usar Boolean(errorMessage)

  return (
    <div className="form">
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
          <TextField inputProps={{"data-testid":"descripcion"}} id="descripcion" value={tarea.descripcion} onChange={cambiarDescripcion} className="formControl" />
        </CardContent>
        <CardContent className="linea">
          <FormLabel>Asignatario:</FormLabel>
        </CardContent>
        <CardContent>
          <Select
            /* Acá podemos ver cómo esta declarado nombreAsignatario */
            value={tarea.nombreAsignatario || ' '}
            onChange={(event) => asignar(event.target.value)}
            className="formControl"
            title="asignatario"
            inputProps={{
              name: 'asignatario',
              id: 'asignatario',
            }}
          >
            <MenuItem value=" ">
              <em>Sin Asignar</em>
            </MenuItem>
            {usuarios.map(usuario => <MenuItem value={usuario.nombre} key={usuario.nombre}>{usuario.nombre}</MenuItem>)}
          </Select>
        </CardContent>
        <CardActions className="botonera">
          <Button variant="contained" color="warning" onClick={aceptarCambios}>
            Aceptar
          </Button>
          <Button variant="outlined" color="warning"onClick={volver}>
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
