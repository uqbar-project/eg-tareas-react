import './asignarTarea.css'

import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import React, { useEffect, useState } from 'react'

import { Tarea } from '../domain/tarea'
import { tareaService } from '../services/tareaService'
import { usuarioService } from '../services/usuarioService'
import { obtenerMensaje } from '../utils/obtenerMensaje'
import { Button, FormLabel, MenuItem, Select, Snackbar, TextField } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'

export const AsignarTareaComponent = () => {

  const [usuarios, setUsuarios] = useState([])
  const [tarea, setTarea] = useState(new Tarea())
  const [errorMessage, setErrorMessage] = useState('')
  const params = useParams()
  const navigate = useNavigate()

  const { id } = params

  useEffect(() => {
    const inicio = async () => {
      try {
        const usuarios = await usuarioService.allInstances()
        const tarea = await tareaService.getTareaById(id)
        setUsuarios(usuarios)
        setTarea(tarea)
      } catch (e) {
        generarError(e)
      }
    }

    inicio()
  }, [id])
    
  const generarError = (error) => {
    setErrorMessage(obtenerMensaje(error))
  }

  const asignar = (asignatario) => {
    const asignatarioNuevo = usuarios.find((usuario) => usuario.nombre === asignatario)
    tarea.asignarA(asignatarioNuevo)
    generarNuevaTarea(tarea)
  }

  const generarNuevaTarea = (tarea) => {
    const nuevaTarea = Tarea.fromJson(tarea.toJSON())
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
    } catch (e) {
      generarError(e)
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
