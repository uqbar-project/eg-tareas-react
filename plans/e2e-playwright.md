# Tests E2E con Playwright

## 1. Instalar dependencias

```bash
pnpm add -D @playwright/test start-server-and-test
pnpm exec playwright install chromium
```

## 2. Crear `scripts/start-backend.sh`

Clona el backend dentro del proyecto (subdirectorio `backend/`) y lo levanta:

```bash
#!/bin/bash
set -e
BACKEND_DIR="backend"
PORT=9000
REPO_URL="https://github.com/uqbar-project/eg-tareas-springboot-kotlin"

if [ ! -d "$BACKEND_DIR/.git" ]; then
  echo "📥 Clonando backend en $BACKEND_DIR..."
  git clone "$REPO_URL" "$BACKEND_DIR"
else
  echo "📡 Actualizando backend..."
  (cd "$BACKEND_DIR" && git pull)
fi

cd "$BACKEND_DIR"
./gradlew bootRun --no-daemon
```

## 3. Agregar `backend/` al `.gitignore`

```
backend/
```

## 4. Crear `playwright.config.ts`

```ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  webServer: {
    command: 'VITE_PAGINATION_ENABLED=false pnpm build && pnpm preview',
    port: 4173,
  },
  testDir: 'e2e',
})
```

## 5. Agregar scripts en `package.json`

```json
"start-backend": "bash ./scripts/start-backend.sh",
"test:e2e": "start-server-and-test 'pnpm run start-backend' http://localhost:9000/health 'pnpm exec playwright test'",
"test:e2e:ui": "playwright test --ui"
```

## 6. Agregar `data-testid` a `tareaRow.tsx`

Agregar los siguientes testids a las celdas del `<tr data-testid={`tarea_${tarea.id}`}>`:

| Celda                     | data-testid             |
| ------------------------- | ----------------------- |
| descripción               | `title_{id}`            |
| fecha formateada          | `fecha_{id}`            |
| nombre asignatario        | `asignatario_{id}`      |
| wrapper `<PorcentajeCumplimiento>` | `porcentaje_{id}` |

## 7. Crear `e2e/tareas.test.ts`

Flujo principal (1 test, describe "flujo principal"):

- **beforeEach**: `POST /usuarios` con `{ nombre: 'Eva Dida' }` → guarda `asignatarioId`
- **Crear**: click `nueva_tarea` → llenar form (`descripcion`, `iteracion`, `fecha`, `asignatario`) → click `crear` + interceptor `waitForResponse` del POST → obtiene `tareaId`
- **Verificar creación**: `title_{id}`, `asignatario_{id}`, `fecha_{id}`, `porcentaje_{id}`
- **Editar**: click `asignar_{id}` → modificar campos → click `aceptar` + interceptor PUT
- **Verificar edición**: textos actualizados
- **Cumplir**: click `cumplir_{id}` → `cumplir_{id}` no visible, `asignar_{id}` no visible
- **Eliminar**: click `eliminar_{id}` → click `eliminar` → `tarea_{id}` no visible
- **afterEach**: `DELETE /usuarios/{asignatarioId}`

Helper `editarTarea()` reutilizada para creación y edición.

## 8. Actualizar `.github/workflows/build.yml`

Agregar paso `npx playwright install chromium --with-deps` y ejecutar `pnpm test:e2e` después de los unitarios.

## 9. Actualizar `README.md`

Agregar sección **Tests e2e** al mismo estilo que la referencia de Svelte, con subsecciones:

```
### Tests e2e

#### Instalación
El script scripts/start-backend.sh clona (o actualiza) el backend de Spring Boot
en backend/ y lo levanta en el puerto 9000 con gradlew.

El comando `pnpm test:e2e` usa start-server-and-test para:
1. Ejecutar el script del backend
2. Esperar que responda http://localhost:9000/health
3. Disparar playwright test

Precondición: tener instalado Playwright
```
npx playwright install --with-deps
```

#### Configuración
Un archivo playwright.config.ts define el webServer (build + preview, puerto 4173)
y la carpeta e2e/.

#### Flujo de un test end-to-end
Explicación del flujo + código del test.

#### Debug manual
- Backend: `pnpm run start-backend`
- UI Playwright: `pnpm test:e2e:ui`

#### e2e + CI
Explicación de CI.

## Mapa de testids: Svelte → React

| Concepto          | Svelte               | React                          |
| ----------------- | -------------------- | ------------------------------ |
| Botón crear tarea | `crear_tarea`        | `nueva_tarea`                  |
| Ruta creación     | `/tarea/nueva`       | `/crearTarea`                  |
| Botón guardar     | `guardar`            | `crear` / `aceptar`            |
| Botón editar      | `editar_tarea_{id}`  | `asignar_{id}`                 |
| Row               | `row_{id}`           | `tarea_{id}`                   |
| Título            | `title_{id}`         | `title_{id}` (a agregar)       |
| Descripción       | `description_{id}`   | `asignatario_{id}` + `fecha_{id}` (separados) |
| Porcentaje        | `porcentaje_{id}`    | `porcentaje_{id}` (a agregar)  |
| Botón cumplir     | `cumplir_{id}`       | `cumplir_{id}`                 |
| Botón eliminar    | `eliminar_{id}`      | `eliminar_{id}`                |
