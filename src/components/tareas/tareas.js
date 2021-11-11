import Paper from '@material-ui/core/Paper'
import Snackbar from '@material-ui/core/Snackbar'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
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
      <Paper>
        <br />
        <h1>Tareas a realizar</h1>
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
      </Paper>
    )
  }

  static get propTypes() {
    return {
      history: PropTypes.object
    }
  }
}

export default TareasComponent