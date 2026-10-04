import type { CSSProperties } from 'react'

const SIN_ASIGNAR = '?'
const TONOS_AVATAR = 10

const HUES_AVATAR = [25, 50, 75, 100, 120, 235, 260, 285, 310, 335]

const TONOS = Array.from({ length: TONOS_AVATAR }, (_, indice) => indice + 1)

const AVANLANZE = [
  (valor: number) => valor ^ (valor >>> 16),
  (valor: number) => Math.imul(valor, 0x85ebca6b),
  (valor: number) => valor ^ (valor >>> 13),
  (valor: number) => Math.imul(valor, 0xc2b2ae35),
  (valor: number) => valor ^ (valor >>> 16),
]

export const inicialesDe = (nombre?: string) => {
  const palabras = nombre?.trim().split(/\s+/).filter(Boolean) ?? []
  if (palabras.length === 0) {
    return SIN_ASIGNAR
  }
  if (palabras.length === 1) {
    return palabras[0].slice(0, 2).toUpperCase()
  }
  const primera = palabras[0].charAt(0).toUpperCase()
  const ultima = palabras[palabras.length - 1].charAt(0).toUpperCase()
  return primera + ultima
}

const hashDe = (nombre: string) =>
  AVANLANZE.reduce(
    (valor, paso) => paso(valor),
    [...nombre]
      .map((caracter) => caracter.charCodeAt(0))
      .reduce((hash, codigo) => (Math.imul(hash, 31) + codigo) | 0, 0) >>> 0
  )

const tonoPorNombre = new Map<string, number>()
const usosPorTono = new Map(TONOS.map((tono) => [tono, 0]))

const claveDe = (nombre: string, tono: number) =>
  (usosPorTono.get(tono) ?? 0) * 0x100000000 +
  ((hashDe(nombre) ^ Math.imul(tono, 0x9e3779b1)) >>> 0)

const registrar = (nombre: string) => {
  const tono = TONOS.reduce((mejor, candidato) =>
    claveDe(nombre, candidato) < claveDe(nombre, mejor) ? candidato : mejor
  )
  tonoPorNombre.set(nombre, tono)
  usosPorTono.set(tono, (usosPorTono.get(tono) ?? 0) + 1)
  return tono
}

const tonoDe = (nombre: string) =>
  tonoPorNombre.get(nombre) ?? registrar(nombre)

export const tonoDeCss = (nombre: string) =>
  ({ '--tono': HUES_AVATAR[tonoDe(nombre) - 1] }) as CSSProperties
