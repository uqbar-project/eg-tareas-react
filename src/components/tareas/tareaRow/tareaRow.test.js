import { shallow } from 'enzyme'
import React from 'react'
import TareaRow from './tareaRow'
import { crearTarea } from '../../../testsUtils/crearTarea'
const getDataTestId = (value) => `[data-testid="${value}"]`

const botonAsignacion = (componente, id) => componente.find(getDataTestId(`asignar_${id}`))
const existeAsignacion = (componente, id) => botonAsignacion(componente, id).exists()
const existeCumplir = (componente, id) => componente.find(getDataTestId(`cumplir_${id}`)).exists()
const mockHistoryPush = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush
  })
}))

describe('TareaRow', () => {
    describe('cuando una tarea está asignada', () => {
        let tareaAsignada
        beforeEach(() => {
            tareaAsignada = crearTarea(159, 'Construir test TODO List', 0, 'Marcos Rojo')
        })
        it('puede cumplirse', () => {
            const componente = shallow(<TareaRow tarea={tareaAsignada} />)
            expect(existeCumplir(componente, tareaAsignada.id)).toBeTruthy()
        })
        describe('si su porcentaje de cumplimiento está completo', () => {
            it('NO se puede asignar', () => {
                tareaAsignada.porcentajeCumplimiento = 100
                const componente = shallow(<TareaRow tarea={tareaAsignada} />)
                expect(existeAsignacion(componente, tareaAsignada.id)).toBeFalsy()
            })
        })
        describe('si su porcentaje de cumplimiento NO está completo', () => {
            it('se puede asignar', () => {
                tareaAsignada.porcentajeCumplimiento = 50
                const componente = shallow(<TareaRow tarea={tareaAsignada} />)
                expect(existeAsignacion(componente, tareaAsignada.id)).toBeTruthy()
            })
            it('y se clickea el boton de asignacion, nos redirige a la ruta de asignacion con el id', () => {
                tareaAsignada.porcentajeCumplimiento = 50
                const componente = shallow(
                    <TareaRow
                        tarea={tareaAsignada}
                    />)
                botonAsignacion(componente, tareaAsignada.id).simulate('click')
                expect(mockHistoryPush).toBeCalledWith(`/asignarTarea/${tareaAsignada.id}`)

            })
        })
    })

    describe('cuando una tarea NO está asignada', () => {
        it('una tarea sin asignar no puede cumplirse', () => {
            const tareaNoAsignada = crearTarea(159, 'Construir test TODO List', 0, 'Marcos Rojo')
            tareaNoAsignada.desasignar()
            const componente = shallow(<TareaRow tarea={tareaNoAsignada} />)
            expect(existeCumplir(componente, tareaNoAsignada.id)).toBeFalsy()
        })
    })
})



