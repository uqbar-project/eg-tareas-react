import './porcentajeCumplimiento.css'

const limiteSuperior = 80
const limiteInferior = 50

const getBackgroundTestId = (porcentaje: number) => {
  if (porcentaje > limiteSuperior) {
    return 'alto'
  }
  if (porcentaje < limiteInferior) {
    return 'bajo'
  }
  return 'medio'
}

const getTonoClass = (porcentaje: number) => {
  if (porcentaje > limiteSuperior) {
    return 'chip chipAlto'
  }
  if (porcentaje < limiteInferior) {
    return 'chip chipBajo'
  }
  return 'chip chipMedio'
}

export const PorcentajeCumplimiento = ({
  porcentaje,
}: {
  porcentaje: number
}) => {
  if (!porcentaje) {
    return null // se puede comentar para ver como se muestra el avatar en 0%
  }
  return (
    <div
      data-testid={getBackgroundTestId(porcentaje)}
      role="progressbar"
      aria-label={`Porcentaje de cumplimiento: ${porcentaje}%`}
      aria-valuenow={porcentaje}
      aria-valuemin={0}
      aria-valuemax={100}
      className={getTonoClass(porcentaje)}
    >
      {porcentaje}%
    </div>
  )
}
