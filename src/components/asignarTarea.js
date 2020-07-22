import React, { useState, useEffect } from 'react'
import { Paper, TextField, Select, MenuItem, FormLabel, Button, Snackbar } from '@material-ui/core'
import { tareaService } from '../services/tareaService'
import { usuarioService } from '../services/usuarioService'
import { Tarea } from '../domain/tarea'
import { PropTypes } from 'prop-types'
import { useParams, useHistory } from 'react-router-dom'


export default function AsignarTareaComponent() {

  const { id } = useParams()
  const [usuarios, setUsuarios] = useState([])
  const [tarea, setTarea] = useState(new Tarea())
  const [errorMessage, setErrorMessage] = useState('')
  const snackbarOpen = !!errorMessage
  const history = useHistory()

  useEffect(() => {
    async function getData() {
      try {
        setUsuarios(await usuarioService.allInstances())
        setTarea(await tareaService.getTareaById(id))
      } catch (e) {
        generarError(e)
      }
    }
    getData()
  }, [id])

  const asignarTarea = async () => {
    try {
      tarea.validarActualizacion()
      await tareaService.actualizarTarea(tarea)
      volver()
    } catch (e) {
      generarError(e)
    }
  }

  const cambiarEstado = (closureChange) => {
    closureChange(tarea)
    setTarea(Object.assign(new Tarea(), tarea))
    setErrorMessage('')
  }

  const generarError = (error) => {
    setErrorMessage(error.response ? error.response.data : error.toString())
  }

  const asignar = (asignatario) => {
    cambiarEstado((tarea) => tarea.asignarA(asignatario))
  }

  const cambiarDescripcion = (event) => {
    const valor = event.target.value
    cambiarEstado((tarea) => tarea.descripcion = valor)
  }

  const volver = () => {
    history.push('/')
  }

    return (
      <Paper>
        <br />
        <h2>Asignar tarea</h2>
        <br />
        <FormLabel>Descripción</FormLabel>
        <br /><br />
        <TextField id="descripcion" value={tarea.descripcion} onChange={cambiarDescripcion} fullWidth />
        <br />
        <br /><br />
        <br /><br />
        <FormLabel>Asignatario</FormLabel>
        <br /><br />
        <Select
          /*Aca podemos ver como esta declarado nombreAsignatario */
          value={tarea.nombreAsignatario}
          onChange={(event) => asignar(event.target.value)}
          className="formControl"
          inputProps={{
            name: 'asignatario',
            id: 'asignatario'
          }}
          data-testid="select-asignar"
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
        <Button variant="contained" color="primary" onClick={asignarTarea} data-testid="aceptar-asignacion">
          Aceptar
        </Button>
        &nbsp;&nbsp;&nbsp;
        <Button variant="contained" onClick={volver} data-testid="cancelar-asignacion">
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
  
AsignarTareaComponent.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object,
}
