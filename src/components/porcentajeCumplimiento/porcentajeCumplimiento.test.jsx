import { render, screen } from '@testing-library/react'

import { PorcentajeCumplimiento } from './porcentajeCumplimiento'

/**
 * DISCLAIMER: estos tests de UI no son buenos
 * 
 * - si cambia la clase del css, o bien si cambiamos material por cualquier otro framework
 *   el test se rompe
 * - no estamos testeando comportamiento
 * - por un buen motivo, React Testing Library no provee helpers para buscar por clase de css
 * - solo los dejamos para mostrar que se puede y como anti-pattern, 
 *   no creemos que sea una buena práctica este tipo de test
 */
describe('porcentaje de cumplimiento', () => {
  test('porcentaje en el límite superior', () => {
    render(<PorcentajeCumplimiento porcentaje={99} />)
    expect(screen.getByTestId('alto')).toBeInTheDocument()
  })
  test('porcentaje intermedio', () => {
    render(<PorcentajeCumplimiento porcentaje={75} />)
    expect(screen.getByTestId('medio')).toBeInTheDocument()
  })

  test('porcentaje más bajo', () => {
    render(<PorcentajeCumplimiento porcentaje={25} />)
    expect(screen.getByTestId('bajo')).toBeInTheDocument()
  })

  test('cuando no se le pasa porcentaje no renderiza un avatar', () => {
    const { container } = render(<PorcentajeCumplimiento />)
    expect(container.innerHTML).toBe('')
  })
})