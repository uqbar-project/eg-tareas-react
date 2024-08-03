import Avatar from '@mui/material/Avatar'

const limiteSuperior = 80
const limiteInferior = 50

const getBackgroundTestId = (porcentaje: number) => {
  if (porcentaje > limiteSuperior) return 'alto'
  if (porcentaje < limiteInferior) return 'bajo'
  return 'medio'
}

const getBackgroundColor = (porcentaje: number) => {
  if (porcentaje > limiteSuperior) return '#0BDA51'
  if (porcentaje < limiteInferior) return 'coral'
  return '#FBEC5D'
}

const getColor = () => 'black'

export const PorcentajeCumplimiento = ({ porcentaje }: { porcentaje: number }) => {
  if (!porcentaje) return null // se puede comentar para ver como se muestra el avatar en 0%
  const backgroundColor = getBackgroundColor(porcentaje)
  const backgroundTestId = getBackgroundTestId(porcentaje)
  const color = getColor()
  return (
    <Avatar
      data-testid={backgroundTestId}
      style={{ backgroundColor, color, fontSize: '0.7rem' }}>
      {porcentaje || 0}%
    </Avatar>
  )
}