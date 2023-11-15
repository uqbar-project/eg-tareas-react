export class Usuario {

  constructor(_nombre) {
    this.nombre = _nombre
  }

  // Lo necesitamos para mostrar el valor seleccionado en el combo
  equals(_otro) {
    return _otro && this.nombre === _otro.nombre
  }

  static fromJSON(nombre) {
    return new Usuario(nombre)
  }

}
