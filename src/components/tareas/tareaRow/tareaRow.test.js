import { shallow } from 'enzyme'
import React from 'react'
import { TareaRow } from './tareaRow'
import { crearTarea } from '../../../testsUtils/crearTarea'

const botonAsignacion = (componente, id) => componente.find(`#asignar_${id}`)
const existeAsignacion = (componente, id) => botonAsignacion(componente, id).exists()
const existeCumplir = (componente, id) => componente.find(`#cumplir_${id}`).exists()

describe('TareaRow', () => {
    describe('cuando una tarea esta asignada', () => {
        let tareaAsignada
        beforeEach(() => {
            tareaAsignada = crearTarea(159, 'Construir test TODO List', 0, 'Marcos Rojo')
        })
        it('puede cumplirse', () => {
            const componente = shallow(<TareaRow tarea={tareaAsignada} />)
            expect(existeCumplir(componente, tareaAsignada.id)).toBeTruthy()
        })
        describe('si su porcentaje de cumplimiento esta completo', () => {
            it('NO se puede asignar', () => {
                tareaAsignada.porcentajeCumplimiento = 100
                const componente = shallow(<TareaRow tarea={tareaAsignada} />)
                expect(existeAsignacion(componente, tareaAsignada.id)).toBeFalsy()
            })
        })
        describe('si su porcentaje de cumplimiento NO esta completo', () => {
            it('se puede asignar', () => {
                tareaAsignada.porcentajeCumplimiento = 50
                const componente = shallow(<TareaRow tarea={tareaAsignada} />)
                expect(existeAsignacion(componente, tareaAsignada.id)).toBeTruthy()
            })
            it('y se clickea el boton de asignacion, nos redirije a la ruta de asignacion con el id', () => {
                tareaAsignada.porcentajeCumplimiento = 50
                const pushEspia = jest.fn()
                const componente = shallow(
                    <TareaRow
                        tarea={tareaAsignada}
                        history={{ push: pushEspia }}
                    />)
                botonAsignacion(componente, tareaAsignada.id).simulate('click')
                expect(pushEspia).toBeCalledWith(`/asignarTarea/${tareaAsignada.id}`)

            })
        })
    })

    describe('cuando una tarea NO esta asignada', () => {
        it('una tarea sin asignar no puede cumplirse', () => {
            const tareaNoAsignada = crearTarea(159, 'Construir test TODO List', 0, 'Marcos Rojo')
            tareaNoAsignada.desasignar()
            const componente = shallow(<TareaRow tarea={tareaNoAsignada} />)
            expect(existeCumplir(componente, tareaNoAsignada.id)).toBeFalsy()
        })
    })
})



