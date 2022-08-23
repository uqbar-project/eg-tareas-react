import { TableContainer } from '@mui/material'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { PropTypes } from 'prop-types'
import React, { Component } from 'react'

import { tareaService } from '../../services/tareaService'
import { obtenerMensaje } from '../../utils/obtenerMensaje'
import TareaRow from './tareaRow/tareaRow'

export class TareasComponent extends Component {

  constructor(props) {
    super(props)
    this.state = {
      tareas: [],
      errorMessage: ''
    }
  }

  async componentDidMount() {
    //debugger //  to show lifecycle
    await this.traerTareas()
  }

  traerTareas = async () => {
    try {
      const tareas = await tareaService.allInstances()
      this.setState({
        tareas,
      })
    } catch (error) {
      this.setState({ errorMessage: obtenerMensaje(error) })
    }
  }

  render() {
    const snackbarOpen = !!this.state.errorMessage

    return (
      <TableContainer component={Paper}>
        <br />
        <h1>Tareas a realizar</h1>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow sx={{ fontWeight: 'bold' }}>
              <TableCell>Tarea</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Asignatario</TableCell>
              <TableCell>% Cumplimiento</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody data-testid="resultados">
            {
              this.state.tareas.map((tarea) =>
                <TareaRow
                  tarea={tarea}
                  key={tarea.id}
                  actualizar={this.traerTareas} />)
            }
          </TableBody>
        </Table>
        <Snackbar
          open={snackbarOpen}
          message={this.state.errorMessage}
          autoHideDuration={4}
        />
      </TableContainer>
    )
  }

  static get propTypes() {
    return {
      history: PropTypes.object
    }
  }
}

export default TareasComponent