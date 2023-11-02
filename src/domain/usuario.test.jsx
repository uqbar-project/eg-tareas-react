import { Usuario } from './usuario'

describe('tests de usuario', () => {
  test('dos usuarios con el mismo nombre son iguales', () => {
    const usuario1 = new Usuario('pepe')
    const usuario2 = new Usuario('pepe')
    expect(usuario1).toEqual(usuario2)
  })

  test('al convertir de JSON se obtiene un usuario con dicho nombre', () => {
    const usuario = Usuario.fromJSON('pepe')
    expect(usuario).toEqual(new Usuario('pepe'))
  })
})