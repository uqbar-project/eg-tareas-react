/// <reference types="Cypress" />
const getDataTestId = (value) => `[data-testid=${value}]`
const tarea = {
    'id': 3,
    'descripcion': 'Desarrollar componente de envio de mails',
    'iteracion': 'Iteración 1',
    'porcentajeCumplimiento': 0,
    'new': false,
    'fecha': '14/11/2019',
    'asignadoA': 'Rodrigo Grisolia'
}
describe('Cumplir una tarea', () => {
    before(() => {
        // iniciamos el server de mock
        cy.server()
        // mockeamos el GET de tareas
        cy.route('/tareas', [tarea])
        cy.visit('/')
    })

    it('cuando clickeamos en el boton cumplir', () => {
        cy.server()
        // volvemos a mockear el GET /tareas, pero esta vez con la tarea completa al 100%
        cy.route('/tareas', [{ ...tarea, porcentajeCumplimiento: 100 }])
        // Tambien tenenemos que mockear el PUT de modificar la tarea
        cy.route({ url: `/tareas/${tarea.id}`, status: 200, response: {}, method: 'PUT' })
        cy.get(getDataTestId('cumplir_3')).click()
    })

    it('se pasa al porcentaje del cumplimiento 100%', () => {
        cy.get(getDataTestId('3_porcentaje_100')).click()
    })
})