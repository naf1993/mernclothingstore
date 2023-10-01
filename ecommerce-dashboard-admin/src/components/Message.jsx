import React from 'react'
import Alert from '@mui/material/Alert';

const Message = ({severity,error}) => {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 999 }}>

<Alert variant='filled' severity={severity}>
      {error}
    </Alert>
    </div>
   
   
 
  )
}

Message.defaultProps = {
    severity:'info'
}

export default Message