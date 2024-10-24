import React from 'react'
import {ClipLoader} from 'react-spinners'

const LoadingFullScreen = () => {
  return (
    <div className='loading-screen'>
        <ClipLoader color='#3498db' loading={true}/>
        <h1>The Modest Store</h1>
      
    </div>
  )
}

export default LoadingFullScreen
