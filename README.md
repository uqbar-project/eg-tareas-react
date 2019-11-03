# Tareas de un equipo de desarrollo

[![Build Status](https://travis-ci.org/uqbar-project/eg-tareas-react.svg?branch=master)](https://travis-ci.org/uqbar-project/eg-tareas-react)

![video](video/demo2.gif)

El ejemplo que muestra las tareas de un equipo de desarrollo, permite asignar, cumplir o modificar la descripción de una tarea.

# Conceptos

- Componentes de React
- Uso de componentes visuales de Material: select (combo), text field, snack bar (message box), tablas, entre otras
- React router que define un master / detail
- Uso de fetch para disparar pedidos asincrónicos tratados con promises
- Manejo del estado

# Arquitectura general

## Página principal: ver tareas

![master](images/componentesVistaMaster.png)

- **TareasComponent**: es el que sabe mostrar la tabla y delega en TareaRow la visualización de cada ítem
- **TareaRow**: conoce cómo mostrar una tarea dentro de una fila de la tabla
- **PorcentajeCumplimiento**: es un componente que muestra un avatar con el % de cumplimiento en diferentes colores. En rojo se visualizan las tareas cuyo % de cumplimiento es menor a 50, luego de 50 a 90% exclusive aparecen en amarillo y por último las que tienen 90% ó más se ven en verde.

![image](images/ArquitecturaTareas.png)

El componente llama al service (que tiene metodos estaticos) quien dispara la búsqueda de tareas y devuelve la promise:

```javascript
>>>TareaService
static allInstances() {
  return fetch(`${REST_SERVER_URL}/tareas`)
}
```

Cuando el pedido vuelve con un estado ok, se actualiza el estado del componente React, transformando la lista de objetos JSON en objetos Tarea:

```javascript
>>>TareasComponent
componentDidMount() {
  this.actualizarTareas()
}

actualizarTareas = () => {
  TareaService.allInstances()
    .then((tareas)=>{
      this.setState({
        tareas: tareas
      })
    })
    .catch((error) => {
      this.errorHandler(error)
    })
}
```

Se encadenan las promises mediante la función then, y se atrapa cualquier excepción dentro del catch.

O utilizando la sintaxis async / await esto se transforma en:

```js
actualizarTareas = async () => {
  try {
    const tareas = await TareaService.allInstances()
    this.setState({
      tareas: tareas
    })
  } catch (error) {
    this.errorHandler(error)
  }
}
```

## Cumplir una tarea

El componente captura el evento del botón:

```javascript
>>>TareaRow
<IconButton aria-label="Cumplir" onClick={cumplirTarea}>
    <CheckCircleIcon />
</IconButton>
```

En ese evento se delega a cumplir de Tarea y se pide al service que actualice el backend. Cuando la promise se cumple, disparamos la funcion que nos pasaron por props y a buscar nuevamente las tareas al backend, para traernos la ultima informacion:

```javascript
>>>TareaRow
const cumplirTarea = async () => {
    tarea.cumplir()
    try {
      await props.tareaService.actualizarTarea(tarea)
      props.actualizar()
    } catch (error) {
      console.log(error)
    }
}
```

El método actualizarTarea del service dispara el método PUT:

```javascript
static actualizarTarea(tarea) {
  return fetch(`${REST_SERVER_URL}/tareas/${tarea.id}`, {
    method: 'put',
    body: JSON.stringify(tarea.toJSON())
  })
}
```

El botón de asignación dispara la navegación de la ruta '/asignar':

```javascript
>>>TareaRow
const goToAsignarTarea = () => {
  props.history.push(`/asignarTarea/${tarea.id}`)
}
<IconButton aria-label="Asignar" onClick={goToAsignarTarea}>
    <AccountBoxIcon />
</IconButton>
```

para lo cual hay que decorar el componente TareaRow con el router de React:

```javascript
export default withRouter(TareaRow)
```

Esto permite que se le inyecte dentro del mapa `props` la referencia `history` que guarda la lista de URLs visitadas y además maneja la navegación de la SPA. Podemos utilizar el mismo history para volver a la página anterior con `props.history.goBack()`. Para más información pueden ver [esta página del Router de React](https://reacttraining.com/react-router/core/guides/philosophy).

## Asignación de tareas

![image](images/ArquitecturaTareasAsignacion.png)

En la asignación de tareas el combo de usuarios se llena con una llamada al servicio REST que trae los usuarios:

```javascript
>>>UsuarioService
static async allInstances() {
  const response = await fetch(`${REST_SERVER_URL}/usuarios`)
  const usuariosJson = await response.json()
  return usuariosJson
}
```

Agregamos en el combo la opción "Sin Asignar":

```javascript
<Select
    value={this.state.tarea.nombreAsignatario}
    onChange={(event) => this.asignar(event.target.value)}
    className="formControl"
    inputProps={{
        name: 'asignatario',
        id: 'asignatario'
    }}
>
    >
        <MenuItem value=" ">
        <em>Sin Asignar</em>
    </MenuItem>
    {this.state.usuarios.map(usuario => <MenuItem value={usuario.nombre} key={usuario.id}>{usuario.nombre}</MenuItem>)}
</Select>
```

La clase formControl especifica un width más grande (el default es muy chico), en el archivo index.css:

```css
.formControl {
  width: 35rem;
  min-width: 35rem;
}
```

Para entender cómo funciona la asignación, el combo dispara el evento de cambio al componente AsignarTareas:

```javascript
... onChange={(event) => this.asignar(event.target.value)}
```

El método asignar recibe el nombre del nuevo asignatario (podríamos recibir el identificador, pero lamentablemente el servicio REST solo nos da el nombre), entonces delegamos a un método más general que actualiza el estado de la tarea:

```javascript
>>>AsignarTareaComponent
asignar(asignatario) {
    this.cambiarEstado((tarea) => tarea.asignarA(asignatario))
}

cambiarEstado(closureChange) {
    const tarea = this.state.tarea
    closureChange(tarea)
    this.setState({
        tarea: tarea,
        errorMessage: ''
    })
}
```

### Un pequeño párrafo para el spread operator

El lector habrá notado esta línea:

```js
this.setState({
    ...this.state,
```

lo que se conoce como _spread operator_, un _syntactic sugar_ que permite expandir un objeto con sus propiedades sin tener que definir explícitamente sus atributos. En el caso de que el estado tuviera además de la tarea otras 4 referencias (ref1, ref2, ref3, ref4), nos evita hacer

```js
this.setState({
    ref1: this.state.ref1,
    ref2: this.state.ref2,
    ref3: this.state.ref3,
    ref4: this.state.ref4,
    tarea: tarea,
    ...
})
```

Ya que recordemos que el estado es inmutable, solo podemos generar un **nuevo** estado en base al actual.

Para más información pueden consultar [esta página](https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Operadores/Spread_operator).

### Continuamos actualizando el estado del componente que asigna una tarea

Al actualizar el estado se dispara el render que refleja el nuevo valor para el combo, y tenemos entonces siempre la tarea actualizada.

Cuando el usuario presiona el botón Aceptar, se dispara el evento asociado que delega la actualización al service y regresa a la página principal.

```javascript
>>>AsignarTareaComponent
async asignarTarea() {
    try {
        this.state.tarea.validarAsignacion()
        await tareaService.actualizarTarea(this.state.tarea)
        this.volver()
    } catch (e) {
        this.generarError(e)
    }
}
```

Se delega la validación en la tarea directamente. Pueden ver la implementación en el código.

# Testing

Ahora que separamos todo en componentes mas chicos y con menos responsabilidades, son mucho mas faciles de testear :tada:

### TareaRow

A este componente le pasamos una tarea por `props` y en base a los diferentes estados de la misma hacemos lo siguiente:
- si está asignada nos aparece el botón que permite marcarla como cumplida
- si esta asignada pero su porcentaje de cumplimiento esta completo no aparece el boton de cumplir
- cuando tocamos el boton de asignar nos redirije hacia otra pagina
- si no está asignada no aparece dicho botón

```javascript
describe('TareaRow', () => {
    describe('cuando una tarea esta asignada', () => {
        let tareaAsignada
        beforeEach(() => {
            tareaAsignada = crearTarea(159, 'Construir test TODO List', 0, 'Marcos Rojo')
        })
        it('puede cumplirse', () => {
            const componente = shallow(<TareaRow tarea={tareaAsignada} />)
            expect(existeCumplir(componente, tareaAsignada.id)).toBeTruthy()
        })
        describe('si su porcentaje de cumplimiento esta completo', () => {
            it('NO se puede asignar', () => {
                tareaAsignada.porcentajeCumplimiento = 100
                const componente = shallow(<TareaRow tarea={tareaAsignada} />)
                expect(existeAsignacion(componente, tareaAsignada.id)).toBeFalsy()
            })
        })
        describe('si su porcentaje de cumplimiento NO esta completo', () => {
            it('se puede asignar', () => {
                tareaAsignada.porcentajeCumplimiento = 50
                const componente = shallow(<TareaRow tarea={tareaAsignada} />)
                expect(existeAsignacion(componente, tareaAsignada.id)).toBeTruthy()
            })
            it('y se clickea el boton de asignacion, nos redirije a la ruta de asignacion con el id', () => {
                tareaAsignada.porcentajeCumplimiento = 50
                const pushEspia = jest.fn()
                const componente = shallow(
                    <TareaRow
                        tarea={tareaAsignada}
                        history={{ push: pushEspia }}
                    />)
                botonAsignacion(componente, tareaAsignada.id).simulate('click')
                expect(pushEspia).toBeCalledWith(`/asignarTarea/${tareaAsignada.id}`)

            })
        })
    })

    describe('cuando una tarea NO esta asignada', () => {
        it('una tarea sin asignar no puede cumplirse', () => {
            const tareaNoAsignada = crearTarea(159, 'Construir test TODO List', 0, 'Marcos Rojo')
            tareaNoAsignada.desasignar()
            const componente = shallow(<TareaRow tarea={tareaNoAsignada} />)
            expect(existeCumplir(componente, tareaNoAsignada.id)).toBeFalsy()
        })
    })
})
```

Aca podemos ver el uso de la funcion `beforeEach`, que lo que hace es ejecutarse cada vez que va a correr un test, nosotros la aprovechamos para tener una tarea nueva cada vez que corramos cada test, asi nos aseguramos que no hay estado compartido entre los diferentes tests :hearth:

Y hacemos uso de un par de funciones auxiliares para no repetir codigo entre nuestros tests: 
```javascript
const botonAsignacion = (componente, id) => componente.find(`#asignar_${id}`)
const existeAsignacion = (componente, id) => botonAsignacion(componente, id).exists()
const existeCumplir = (componente, id) => componente.find(`#cumplir_${id}`).exists()
```


### Tareas

## Mockear el servicio

La parte más interesante de los tests es cómo hacemos para interceptar las llamadas a nuestros **services**, lo primero es crear nuestros datos de mock

```javascript
function crearTarea(id, descripcion, porcentaje, asignado) {
  const result = new Tarea()
  result.id = id
  result.descripcion = descripcion
  result.porcentaje = porcentaje
  result.asignatario = new Usuario(asignado)
  return result
}

const construirTest = crearTarea(159, "Construir test TODO List", 0, "Marcos Rojo")

const mockTareas =
  [
    crearTarea(68, "Desarrollar TODO List en React", 75, "Paula Paretto"),
    construirTest
  ]
```

Y ahora sí podemos construir una _promise mockeada_, dentro de nuestros tests :

Ya que nuestro servicio de tareas es estatico, podriamos pisar el metodo en el contexto de los tests haciendo que devuelva una promesa con lo que nosotros queramos directamnete, de la siguiente manera :

```javascript
TareaService.allInstances = () => Promise.resolve(mockTareas)
```

Y nuestro test quedaria de la siguiente forma :

```javascript
describe('TareasComponent', () => {
  describe('cuando el servicio respode correctamente', () => {
    it('se muestran las tareas en la tabla', () => {
      TareaService.allInstances = () => Promise.resolve(mockTareas)
      const componente = shallow(<TareasComponent />)
      setImmediate(() => {
        expect(componente.find('#tarea_159').exists()).toBeTruthy()
        expect(componente.find('#tarea_68').exists()).toBeTruthy()
      })
    })
  })
})
```

Tenemos que usar un `setImmediate` para esperar a que nuestro componente termine de renderizar el jsx y ahi nosotros poder buscar las tareas

