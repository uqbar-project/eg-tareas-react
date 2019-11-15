/// <reference types="Cypress" />
const getDataTestId = (value) => `[data-testid=${value}]`
const asignarButton = (id) => getDataTestId(`asignar_${id}`)
const tarea = {
    'id' : 1,
    'descripcion' : 'Desarrollar componente de envio de mails',
    'iteracion' : 'Iteración 1',
    'porcentajeCumplimiento' : 0,
    'new' : false,
    'fecha' : '14/11/2019'
  }
describe('Asignar tarea a usuario', () => {
    before(() => {
        cy.server()
        //obtenemos los datos del fixture/usuarios.json
        return cy.fixture('usuarios')
        .then(usuarios => {
            //mockeamos a los usuarios
            cy.route('/usuarios', usuarios)
            // mockeamos las tareas
            cy.route('/tareas',[ tarea ])
            // mockeamos el detalle de una tarea
            cy.route('/tareas/1',tarea)

        })
    })

    it('cuando clickeamos en el boton cumplir', () => {
        cy.visit('/')
        cy.get(asignarButton(1)).click()
    })

    it('nos redirije a la pagina de asignacion',()=>{
        cy.url().should('include', '/asignarTarea/1')
    })

    it('seleccionamos un usuario',()=>{
        cy.get(getDataTestId('select-asignar')).click()
        cy.get('[data-value="Rodrigo Grisolia"]').click()
    })
    
    it('tocamos aceptar y nos devuelve a la home',()=>{
        cy.server()
        // mockeamos las tareas con la tarea asignada
        cy.route('/tareas', [ {...tarea , asignadoA:'Rodrigo Grisolia'} ])
        cy.get(getDataTestId('aceptar-asignacion')).click()
        cy.url().should('eq', 'http://localhost:3000/')
    })

    it('y el usuario queda asignado',()=>{
        cy.get(getDataTestId('nombre-asignatario_1')).contains('Rodrigo Grisolia')
    })
})