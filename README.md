
# Tareas de un equipo de desarrollo

[![Build React App](https://github.com/uqbar-project/eg-hola-mundo-react/actions/workflows/build.yml/badge.svg?branch=master)](https://github.com/uqbar-project/eg-hola-mundo-react/actions/workflows/build.yml) ![coverage](./badges/coverage/coverage.svg)

![video](video/demo2.gif)

El ejemplo que muestra las tareas de un equipo de desarrollo, permite asignar, cumplir o modificar la descripción de una tarea.

# Coverage

Extrañamente, tuvimos que renombrar los archivos de test por spec para poder tener un correcto porcentaje de cobertura. Ejemplo: `porcentajeCobertura.test.js` pasó a llamarse `porcentajeCobertura.spec.js`.

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

El componente llama al service (singleton) quien dispara la búsqueda de tareas y devuelve la promise:

```javascript
class TareaService {
  async allInstances() {
    const tareasJson = await axios.get(`${REST_SERVER_URL}/tareas`)
    return tareasJson.data.map((tareaJson) => Tarea.fromJson(tareaJson)) // o ... this.tareaAsJson
  }
```

Cuando el pedido vuelve con un estado ok, se actualiza el estado del componente React, transformando la lista de objetos JSON en objetos Tarea:

```js
class TareasComponent {
  componentDidMount() {
    this.actualizarTareas()
  }

  actualizarTareas = async () => {
    try {
      const tareas = await tareaService.allInstances()
      this.setState({
        tareas, // recordemos que equivale a tareas: tareas,
      })
    } catch (error) {
      this.setState({ errorMessage: obtenerMensaje(error) })
    }
  }
```

También podríamos utilizar la sintaxis de promises común `then().catch()`.

## Cumplir una tarea

El componente captura el evento del botón:

```js
export const TareaRow = (props) => {

  <IconButton aria-label="Cumplir" onClick={cumplirTarea}>
      <CheckCircleIcon />
  </IconButton>
```

En ese evento se delega a cumplir de Tarea y se pide al service que actualice el backend. Cuando la promise se cumple, disparamos la función que nos pasaron por props para buscar nuevamente las tareas al backend, así traemos la última información:

```js
// en el componente funcional TareaRow
const cumplirTarea = async () => {
    tarea.cumplir()
    try {
      await tareaService.actualizarTarea(tarea)
      props.actualizar()
    } catch (error) {
      this.generarError(error)
    }
}
```

El método actualizarTarea del service dispara el pedido PUT al backend:

```js
actualizarTarea(tarea) {
  return axios.put(`${REST_SERVER_URL}/tareas/${tarea.id}`, tarea.toJSON())
}
```

El botón de asignación dispara la navegación de la ruta '/asignar' (en TareaRow):

```js
const goToAsignarTarea = () => {
    props.history.push(`/asignarTarea/${tarea.id}`)
}
```

según lo definido en las rutas del archivo `routes.js`:

```js
export const TareasRoutes = () => (
    <Router>
        <Route exact={true} path="/" component={TareasComponent} />
        <Route path="/asignarTarea/:id" component={AsignarTareaComponent} />
    </Router>
)
```

para lo cual hay que decorar el componente TareaRow con el router de React:

```js
export default withRouter(TareaRow)
```

Esto permite que se le inyecte dentro del mapa `props` la referencia `history` que guarda la lista de URLs visitadas y además maneja la navegación de la SPA. Podemos utilizar el mismo history para volver a la página anterior con `props.history.goBack()`. Para más información pueden ver [esta página del Router de React](https://reacttraining.com/react-router/core/guides/philosophy).

## Asignación de tareas

![image](images/ArquitecturaTareasAsignacion.png)

En la asignación de tareas el combo de usuarios se llena con una llamada al servicio REST que trae los usuarios:

```js
class UsuarioService {

  async allInstances() {
    const { data } = await axios.get(`${REST_SERVER_URL}/usuarios`)
    return data
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

La clase formControl especifica un width más grande (el default es muy chico), en el archivo `index.css`:

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

El método asignar recibe el nombre del nuevo asignatario (podríamos recibir el identificador, pero lamentablemente el servicio REST solo nos da el nombre), entonces delegamos a un método más general que actualiza el estado de la tarea. En el componente AsignarTareaComponent:

```javascript
asignar = (asignatario) => {
  const tarea = this.state.tarea
  tarea.asignarA(asignatario)
  this.cambiarEstado(tarea)
}

cambiarEstado = (tarea) => {
  // generamos una copia de la tarea, sabiendo que no necesita una copia profunda
  const newTarea = Object.assign(tarea)
  this.setState({
    tarea: newTarea,
    errorMessage: '',
  })
}
```

### Continuamos actualizando el estado del componente que asigna una tarea

Al actualizar el estado se dispara el render que refleja el nuevo valor para el combo, y tenemos entonces siempre la tarea actualizada.

Cuando el usuario presiona el botón Aceptar, se dispara el evento asociado que delega la actualización al service y regresa a la página principal.

```javascript
aceptarCambios = async () => {
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

## Keys de componentes custom en un loop

Veamos el código que muestra la lista de tareas:

```js
  <TableBody data-testid="resultados">
    {
      this.state.tareas.map((tarea) =>
        <TareaRow
          tarea={tarea}
          key={tarea.id}
          actualizar={this.actualizarTareas} />)
    }
  </TableBody>
```

Como lo cuenta [la documentación de React](https://es.reactjs.org/docs/lists-and-keys.html), es importante dar a cada uno de nuestros componentes custom (`TareaRow` en este caso) una **key** para identificar rápidamente qué componentes están asociados a un cambio de estado (el Virtual DOM interno que maneja React). La restricción que deben cumplir los componentes hermanos es que a) sus **key** sean únicas, b) que existan.

Si eliminamos la línea que genera la key, el Linter de React nos muestra un mensaje de error: `Missing "key" prop for element in iterator`. Pero qué ocurre si definimos una clave constante, como por ejemplo `1`:

```js
<TableBody data-testid="resultados">
  {
    this.state.tareas.map((tarea) =>
      <TareaRow
        tarea={tarea}
        key={1}
        actualizar={this.actualizarTareas} />)
  }
</TableBody>
```

![Misma clave](./video/sameKey.gif)

- por un lado en la consola nos aparece un error en runtime, donde nos alerta que definir la misma clave puede producir inconsistencias en las actualizaciones de la página
- por otro lado, cuando cumplimos una tarea, se actualizan innecesariamente todas las filas de la tabla. Podría pasar incluso que se actualice la información de las filas incorrectas

La necesidad de trabajar con **key** únicas entre hermanos solo es necesaria cuando tenemos un loop, una iteración (no ocurre cuando estamos definiendo un componente solo).

# Testing

Ahora que separamos todo en componentes más chicos y con menos responsabilidades, son mucho más fáciles de testear :tada:

### TareaRow

A este componente le pasamos una tarea por `props` y basándonos en los diferentes estados de la misma hacemos lo siguiente:
- si está asignada nos aparece el botón que permite marcarla como cumplida
- si está asignada pero su porcentaje de cumplimiento está completo no aparece el botón cumplir
- cuando tocamos el botón asignar nos redirige hacia otra página
- si no está asignada no aparece dicho botón

El lector puede ver la implementación en el archivo [tareaRow.test.js](./src/components/tareas/tareaRow/tareaRow.test.js), vamos a detenernos en dos detalles de implementación nuevos. El primero es que la función `getByTestId` tira error si el elemento que buscamos no existe, por ese motivo usamos `queryByTestId`:

```js
  test('si su porcentaje de cumplimiento está completo NO se puede asignar', () => {
      tareaAsignada.porcentajeCumplimiento = 100
      const { queryByTestId } = render(<TareaRow tarea={tareaAsignada} />)
      expect(queryByTestId('cumplir_' + tareaAsignada.id)).toBeNull()
  })
```

Y el segundo es que usamos un **spy** para escuchar a qué ruta nos dirigimos cuando la asignación se hizo correctamente:

```js
  test('y se clickea el boton de asignacion, nos redirige a la ruta de asignacion con el id', () => {
      tareaAsignada.porcentajeCumplimiento = 45
      const pushEspia = jest.fn()
      const { getByTestId } = render(
          <TareaRow
              tarea={tareaAsignada}
              history={{ push: pushEspia }}
          />)

      fireEvent.click(getByTestId('asignar_' + tareaAsignada.id))
      expect(pushEspia).toBeCalledWith(`/asignarTarea/${tareaAsignada.id}`)
  })
```

### Tareas

## Mockear el servicio

La parte más interesante de los tests es cómo hacemos para interceptar las llamadas a nuestros **services**, lo primero es crear nuestros datos de mock (pueden ver la implementación en el archivo [crearTarea.js](./src/testsUtils/crearTarea.js)). Y ahora sí podemos construir una _promise mockeada_, dentro de nuestros tests. Como nuestro servicio de tareas es un singleton, podemos pisar el método en el contexto de los tests haciendo que devuelva una promesa con lo que nosotros queramos directamente, de la siguiente manera:

```javascript
tareaService.allInstances = () => Promise.resolve(mockTareas)
```

Y nuestro test queda de la siguiente forma :

```js
  describe('cuando el servicio responde correctamente', () => {
    test('se muestran las tareas en la tabla', async () => {
      tareaService.allInstances = () => Promise.resolve(mockTareas)
      const { getByTestId } = render(<BrowserRouter><TareasComponent /></BrowserRouter>)
      //
      // está deprecado para la versión 10 de React Testing Library
      await wait()
      //
      expect(getByTestId('tarea_159')).toBeInTheDocument()
      expect(getByTestId('tarea_68')).toBeInTheDocument()
    })
  })
```

Tenemos que usar un `wait` para esperar a que nuestro componente termine de renderizar el jsx y así poder encontrar las tareas. A partir de las versión 10 de React Testing Library deberemos usar [waitFor](https://testing-library.com/docs/dom-testing-library/api-async):

```js
  describe('cuando el servicio responde correctamente', () => {
    test('se muestran las tareas en la tabla', async () => {
      tareaService.allInstances = () => Promise.resolve(mockTareas)
      const { getByTestId } = render(<BrowserRouter><TareasComponent /></BrowserRouter>)
      // nueva variante -> waitFor
      await waitFor(() => {
        expect(getByTestId('tarea_159')).toBeInTheDocument()
        expect(getByTestId('tarea_68')).toBeInTheDocument()
      })
      //
    })
  })
```

pero debemos esperar a que React y su biblioteca de testing se alineen correspondientemente.
