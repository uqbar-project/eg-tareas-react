import { shallow } from 'enzyme'
import React from 'react'
import { PorcentajeCumplimiento } from './porcentajeCumplimiento'

const getAvatarBy = (componente, selector) => componente.find(selector)

const getAvatarByColor = (componente, color) => componente.find({ style: { backgroundColor: color } })

describe('PorcentajeCumplimiento', () => {
    describe('cuando se le pasa un porcentaje', () => {
        describe('y el porcentaje es mayor a 80', () => {
            const componente = shallow(<PorcentajeCumplimiento porcentaje={99} />)
            it('renderiza un avatar verde', () => {
                expect(getAvatarByColor(componente, 'green').exists()).toBeTruthy()
            })
        })
        describe('y el porcentaje es menor a 80 pero mayor a 50', () => {
            const componente = shallow(<PorcentajeCumplimiento porcentaje={75} />)
            it('renderiza un avatar amarillo', () => {
                expect(getAvatarByColor(componente, 'gold').exists()).toBeTruthy()
            })
        })
        describe('y el porcentaje es menor a 50', () => {
            const componente = shallow(<PorcentajeCumplimiento porcentaje={25} />)
            it('renderiza un avatar rojo', () => {
                expect(getAvatarByColor(componente, 'darkred').exists()).toBeTruthy()
            })
        })
    })

    describe('cuando no se le pasa un porcentaje', () => {
        const componente = shallow(<PorcentajeCumplimiento />)
        it('no renderiza un avatar', () => {
            expect(getAvatarBy(componente, 'Avatar').exists()).toBeFalsy()
        })
    })
})