import { expect, type Page, test } from '@playwright/test'

const NUEVO_USUARIO = 'Eva Dida'

const navegarAlInicio = async (page: Page) => {
  await page.goto('/')
}

const crearTarea = async (
  page: Page,
  {
    descripcion,
    iteracion,
    fecha,
  }: {
    descripcion: string
    iteracion: string
    fecha: string
  }
) => {
  await page.getByTestId('nueva_tarea').click()
  await page.waitForURL('/crearTarea')

  await page.getByTestId('descripcion').fill(descripcion)
  await page.getByTestId('iteracion').fill(iteracion)
  await page.getByTestId('fecha').fill(fecha)

  const [response] = await Promise.all([
    page.waitForResponse(
      (resp) =>
        resp.url().includes('/tareas') && resp.request().method() === 'POST'
    ),
    page.getByTestId('crear').click(),
  ])
  const tareaId = (await response.json()).id

  await page.waitForURL('/')
  return tareaId
}

const verificarTarea = async (
  page: Page,
  tareaId: number,
  campos: Record<string, string>
) => {
  await expect(page.getByTestId(`tarea_${tareaId}`)).toBeVisible()
  for (const [campo, valor] of Object.entries(campos)) {
    await expect(page.getByTestId(`${campo}_${tareaId}`)).toHaveText(valor)
  }
}

const editarTarea = async (
  page: Page,
  tareaId: number,
  {
    descripcion,
    asignadoA,
  }: {
    descripcion: string
    asignadoA: string
  }
) => {
  await page.getByTestId(`asignar_${tareaId}`).click()
  await page.waitForURL(`/asignarTarea/${tareaId}`)

  // esperamos a que se carguen los datos asincrónicos (tarea + usuarios)
  // antes de modificar el formulario
  await expect(page.getByTestId('descripcion')).not.toHaveValue('')
  await expect(
    page.locator(
      `select[data-testid="asignatario"] option[value="${asignadoA}"]`
    )
  ).toBeVisible()

  await page.getByTestId('descripcion').fill(descripcion)
  await page.getByTestId('asignatario').selectOption(asignadoA)

  await Promise.all([
    page.waitForResponse(
      (resp) =>
        resp.url().includes('/tareas') && resp.request().method() === 'PUT'
    ),
    page.getByTestId('aceptar').click(),
  ])

  await page.waitForURL('/')
}

const cumplirTarea = async (page: Page, tareaId: number) => {
  await page.getByTestId(`cumplir_${tareaId}`).click()
  await expect(page.getByTestId(`cumplir_${tareaId}`)).not.toBeVisible()
  await expect(page.getByTestId(`asignar_${tareaId}`)).not.toBeVisible()
}

const eliminarTarea = async (page: Page, tareaId: number) => {
  await page.getByTestId(`eliminar_${tareaId}`).click()
  await page.waitForURL(`/eliminarTarea/${tareaId}`)
  await page.getByTestId('eliminar').click()
  await expect(page.getByTestId(`tarea_${tareaId}`)).not.toBeVisible()
}

test.describe('flujo principal', () => {
  let asignatarioId: number

  test.beforeEach(async ({ request }) => {
    const response = await request.post('http://localhost:9000/usuarios', {
      data: { nombre: NUEVO_USUARIO },
    })
    expect(response.ok()).toBeTruthy()
    const json = await response.json()
    asignatarioId = json.id
  })

  test.afterEach(async ({ request }) => {
    const response = await request.delete(
      `http://localhost:9000/usuarios/${asignatarioId}`
    )
    expect(response.ok()).toBeTruthy()
  })

  test('creamos una tarea, la editamos, la cumplimos y la eliminamos', async ({
    page,
  }) => {
    await navegarAlInicio(page)

    const tareaId = await crearTarea(page, {
      descripcion: 'Agregar tests e2e',
      iteracion: 'Kepler',
      fecha: '2025-11-25',
    })

    await verificarTarea(page, tareaId, {
      title: 'Agregar tests e2e',
    })

    await editarTarea(page, tareaId, {
      descripcion: 'Agregar tests e2e con Playwright',
      asignadoA: NUEVO_USUARIO,
    })

    await verificarTarea(page, tareaId, {
      title: 'Agregar tests e2e con Playwright',
      asignatario: NUEVO_USUARIO,
    })

    await cumplirTarea(page, tareaId)

    await eliminarTarea(page, tareaId)
  })
})
