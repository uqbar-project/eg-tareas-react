import { describe, expect, test } from 'vitest'
import { Usuario } from './usuario'

describe('tests de usuario', () => {
  test('dos usuarios con el mismo nombre son iguales', () => {
    const usuario1 = new Usuario('pepe')
    const usuario2 = new Usuario('pepe')
    expect(usuario1).toEqual(usuario2)
  })

  test('equals con null devuelve false', () => {
    const usuario = new Usuario('pepe')
    expect(usuario.equals(null as unknown as Usuario)).toBeFalsy()
  })

  test('equals con nombres diferentes devuelve false', () => {
    const usuario = new Usuario('pepe')
    const otro = new Usuario('juan')
    expect(usuario.equals(otro)).toBeFalsy()
  })

  test('equals con el mismo nombre devuelve true', () => {
    const usuario = new Usuario('pepe')
    const otro = new Usuario('pepe')
    expect(usuario.equals(otro)).toBeTruthy()
  })

  test('al convertir de JSON se obtiene un usuario con dicho nombre', () => {
    const usuario = Usuario.fromJSON('pepe')
    expect(usuario).toEqual(new Usuario('pepe'))
  })
})
