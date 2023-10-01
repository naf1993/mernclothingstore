import React from 'react'

const Icon = ({width,height,color}) => {
  return (
    <svg width={width} height={height}>
    <path fill={color}/>
  </svg>
  )
}

export default Icon