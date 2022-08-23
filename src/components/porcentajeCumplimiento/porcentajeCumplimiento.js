import Avatar from '@mui/material/Avatar'
import PropTypes from 'prop-types'
import React from 'react'

const getBackgroundColor = (porcentaje) => {
  if (porcentaje > 80) return '#0BDA51'
  if (porcentaje < 50) return 'coral'
  return '#FBEC5D'
}

const getColor = (porcentaje) => {
  return 'black'
}

export const PorcentajeCumplimiento = ({ porcentaje }) => {
  if (!porcentaje) return null // se puede comentar para ver como se muestra el avatar en 0%
  const backgroundColor = getBackgroundColor(porcentaje)
  const color = getColor(porcentaje)
  return (
    <Avatar
      data-testid={backgroundColor}
      style={{ backgroundColor, color, fontSize: '0.7rem' }}>
      {porcentaje || 0}%
    </Avatar>
  )
}

PorcentajeCumplimiento.propTypes = {
  porcentaje: PropTypes.number
}