import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import PropTypes from 'prop-types'

export function PorcentajeCumplimiento({tareaId, porcentaje}) { // hablar de destructuring
    const backgroundColor = () => {
        if (porcentaje > 80) return 'green'
        if (porcentaje < 50) return 'darkred'
        return 'gold'
    }
    if (!porcentaje) return null // se puede comentar para ver como se muestra el avatar en 0%
    return (
        <Avatar
            data-testid={`${tareaId}_porcentaje_${porcentaje}`}
            style={{ backgroundColor: backgroundColor(), fontSize: '0.7rem' }}>
            {porcentaje || 0}%
        </Avatar>
    )
}

PorcentajeCumplimiento.propTypes = {
    porcentaje: PropTypes.number,
    tareaId: PropTypes.number
}