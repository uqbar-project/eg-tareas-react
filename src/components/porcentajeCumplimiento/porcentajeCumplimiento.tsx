const limiteSuperior = 80
const limiteInferior = 50

const getBackgroundTestId = (porcentaje: number) => {
  if (porcentaje > limiteSuperior) return 'alto'
  if (porcentaje < limiteInferior) return 'bajo'
  return 'medio'
}

const getBackgroundColor = (porcentaje: number) => {
  if (porcentaje > limiteSuperior) return 'var(--background-color-success)'
  if (porcentaje < limiteInferior) return 'var(--background-color-error)'
  return 'var(--background-color-warning)'
}

const getColor = (porcentaje: number) => {
  if (porcentaje > limiteSuperior) return 'var(--color-text-success)'
  if (porcentaje < limiteInferior) return 'var(--color-text-error)'
  return 'var(--color-text-warning)'
}

export const PorcentajeCumplimiento = ({ porcentaje }: { porcentaje: number }) => {
  if (!porcentaje) return null // se puede comentar para ver como se muestra el avatar en 0%
  const backgroundColor = getBackgroundColor(porcentaje)
  const backgroundTestId = getBackgroundTestId(porcentaje)
  const color = getColor(porcentaje)
  return (
    <div
      data-testid={backgroundTestId}
      style={{ backgroundColor, color, fontSize: '0.8rem', padding: '0.5em 1em', borderRadius: '1em', width: '4em', margin: 'auto'}}>
      {porcentaje || 0}%
    </div>
  )
}