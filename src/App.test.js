import { shallow } from 'enzyme'
import React from 'react'
import App from './App'

it('app levanta ok', () => {
  shallow(<App />)
})