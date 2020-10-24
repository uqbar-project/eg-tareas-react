import { fireEvent, render } from '@testing-library/react'
import React from 'react'

import { crearTarea } from '../../../testsUtils/crearTarea'
import { TareaRow } from './tareaRow'

describe('TareaRow', () => {
    describe('cuando una tarea está asignada', () => {
        let tareaAsignada
        beforeEach(() => {
            tareaAsignada = crearTarea(159, 'Construir test TODO List', 0, 'Marcos Rojo')
        })
        test('puede cumplirse', () => {
            const { getByTestId } = render(<TareaRow tarea={tareaAsignada} />)
            expect(getByTestId('cumplir_' + tareaAsignada.id)).toBeInTheDocument()
        })
        test('si su porcentaje de cumplimiento está completo NO se puede asignar', () => {
            tareaAsignada.porcentajeCumplimiento = 100
            const { queryByTestId } = render(<TareaRow tarea={tareaAsignada} />)
            expect(queryByTestId('cumplir_' + tareaAsignada.id)).toBeNull()
        })
        describe('si su porcentaje de cumplimiento NO está completo', () => {
            test('se puede asignar', () => {
                tareaAsignada.porcentajeCumplimiento = 50
                const { getByTestId } = render(<TareaRow tarea={tareaAsignada} />)
                expect(getByTestId('asignar_' + tareaAsignada.id)).toBeInTheDocument()
            })
            test('y se clickea el boton de asignacion, nos redirige a la ruta de asignacion con el id', () => {
                tareaAsignada.porcentajeCumplimiento = 45
                const pushEspia = jest.fn()
                const { getByTestId } = render(
                    <TareaRow
                        tarea={tareaAsignada}
                        history={{ push: pushEspia }}
                    />)

                fireEvent.click(getByTestId('asignar_' + tareaAsignada.id))
                expect(pushEspia).toBeCalledWith(`/asignarTarea/${tareaAsignada.id}`)
            })
        })
    })

    describe('cuando una tarea NO está asignada', () => {
        test('una tarea sin asignar no puede cumplirse', () => {
            const tareaNoAsignada = crearTarea(159, 'Construir test TODO List', 0, 'Marcos Rojo')
            tareaNoAsignada.desasignar()
            const { queryByTestId } = render(<TareaRow tarea={tareaNoAsignada} />)
            expect(queryByTestId('cumplir_' + tareaNoAsignada.id)).toBeNull()
        })
    })
})
