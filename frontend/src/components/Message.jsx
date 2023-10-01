import React from 'react'
import {Alert} from 'react-bootstrap'

const Message = ({variant,error}) => {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 999 }}>
    <Alert variant={variant}>
        {error}
    </Alert>
    </div>
  )
}

Message.defaultProps = {
    variant:'info'
}

export default Message