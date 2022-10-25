import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import { crearTarea } from '../../../testsUtils/crearTarea'
import { TareaRow } from './tareaRow'

const mockedNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}))

describe('TareaRow', () => {

    describe('cuando una tarea está asignada', () => {
        let tareaAsignada

        beforeEach(() => {
            tareaAsignada = crearTarea(159, 'Construir test TODO List', 0, 'Marcos Rojo')
        })

        test('puede cumplirse', () => {
            render(<BrowserRouter><TareaRow tarea={tareaAsignada} /></BrowserRouter>)
            expect(screen.getByTestId('cumplir_' + tareaAsignada.id)).toBeInTheDocument()
        })
        test('si su porcentaje de cumplimiento está completo NO se puede asignar', () => {
            tareaAsignada.cumplir()
            render(<BrowserRouter><TareaRow tarea={tareaAsignada} /></BrowserRouter>)
            expect(screen.queryByTestId('cumplir_' + tareaAsignada.id)).toBeNull()
        })
        describe('si su porcentaje de cumplimiento NO está completo', () => {
            test('se puede asignar', () => {
                tareaAsignada.porcentajeCumplimiento = 50
                render(<BrowserRouter><TareaRow tarea={tareaAsignada} /></BrowserRouter>)
                expect(screen.getByTestId('asignar_' + tareaAsignada.id)).toBeInTheDocument()
            })
            test('y se clickea el boton de asignacion, nos redirige a la ruta de asignacion con el id', async () => {
                tareaAsignada.porcentajeCumplimiento = 45
                render(
                    <BrowserRouter>
                        <TareaRow
                            tarea={tareaAsignada}
                            />
                    </BrowserRouter>
                )

                fireEvent.click(screen.getByTestId('asignar_' + tareaAsignada.id))
                await waitFor(() => {
                    expect(mockedNavigate).toBeCalledWith(`/asignarTarea/${tareaAsignada.id}`)
                })
            })
        })
    })

    describe('cuando una tarea NO está asignada', () => {
        test('no puede cumplirse', () => {
            const tareaNoAsignada = crearTarea(159, 'Construir test TODO List', 0, 'Marcos Rojo')
            tareaNoAsignada.desasignar()
            render(<BrowserRouter><TareaRow tarea={tareaNoAsignada} /></BrowserRouter>)
            expect(screen.queryByTestId('cumplir_' + tareaNoAsignada.id)).toBeNull()
        })
    })
})