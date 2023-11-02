import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { vi, expect, test, beforeEach } from 'vitest'

import { crearTarea } from '../../../testsUtils/crearTarea'
import { TareaRow } from './tareaRow'
  
const mockedNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
    const mockedRouter = await vi.importActual('react-router-dom')

    return {
        ...mockedRouter,
        useNavigate: () => mockedNavigate,
    }
})

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
            test('y se clickea el boton de asignacion, nos redirige a la ruta de asignacion con el id de la tarea', async () => {
                render(
                    <BrowserRouter>
                        <TareaRow
                            tarea={tareaAsignada}
                            />
                    </BrowserRouter>
                )

                await userEvent.click(screen.getByTestId('asignar_' + tareaAsignada.id))
                expect(mockedNavigate).toBeCalledWith(`/asignarTarea/${tareaAsignada.id}`)
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