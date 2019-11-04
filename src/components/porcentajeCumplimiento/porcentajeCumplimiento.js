import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import PropTypes from 'prop-types'

export function PorcentajeCumplimiento(props) {
    const backgroundColor = () => {
        if (props.porcentaje > 80) return 'green'
        if (props.porcentaje < 50) return 'darkred'
        return 'gold'
    }
    if (!props.porcentaje) return null // se puede comentar para ver como se muestra el avatar en 0%
    return (
        <Avatar
            style={{ backgroundColor: backgroundColor(), fontSize: '0.7rem' }}>
            {props.porcentaje || 0}%
        </Avatar>
    )
}

PorcentajeCumplimiento.propTypes = {
    porcentaje: PropTypes.number
}