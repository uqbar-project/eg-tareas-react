import type { TareaJSON } from 'src/domain/tarea'

export const mockTareaJSON: TareaJSON = {
  id: 159,
  descripcion: 'Ejemplo',
  iteracion: '',
  asignadoA: 'Margarito Tereré',
  porcentajeCumplimiento: 0,
  fecha: '10/10/2015',
}

export const mockTareasJSON: TareaJSON[] = [
  {
    id: 68,
    descripcion: 'Desarrollar TODO List en React',
    porcentajeCumplimiento: 75,
    asignadoA: 'Paula Paretto',
    iteracion: '',
    fecha: '10/10/2015',
  },
  {
    id: 159,
    descripcion: 'Construir test TODO List',
    porcentajeCumplimiento: 0,
    asignadoA: 'Eliana Mendia',
    iteracion: '',
    fecha: '10/10/2015',
  },
]

export const mockUsuarios = [
  { id: 1, nombre: 'Margarito Tereré' },
  { id: 2, nombre: 'Misia Pataca' },
]
