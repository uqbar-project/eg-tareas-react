export class Usuario {

  constructor(public nombre = '') {
  }

  // Lo necesitamos para mostrar el valor seleccionado en el combo
  equals(otroUsuario: Usuario) {
    return otroUsuario && this.nombre === otroUsuario.nombre
  }

  static fromJSON(nombre: string) {
    return new Usuario(nombre)
  }

}
