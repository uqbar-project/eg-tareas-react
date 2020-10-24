import Avatar from '@material-ui/core/Avatar'
import PropTypes from 'prop-types'
import React from 'react'

const getBackgroundColor = (porcentaje) => {
  if (porcentaje > 80) return 'green'
  if (porcentaje < 50) return 'darkred'
  return 'gold'
}

export const PorcentajeCumplimiento = ({ porcentaje }) => {
  if (!porcentaje) return null // se puede comentar para ver como se muestra el avatar en 0%
  const backgroundColor = getBackgroundColor(porcentaje)
  return (
    <Avatar
      data-testid={backgroundColor}
      style={{ backgroundColor, fontSize: '0.7rem' }}>
      {porcentaje || 0}%
    </Avatar>
  )
}

PorcentajeCumplimiento.propTypes = {
  porcentaje: PropTypes.number
}