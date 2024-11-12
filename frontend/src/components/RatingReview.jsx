import React from 'react'

const RatingReview = ({value,text}) => {
  return (
    <span className='rating-review'>
        <span>
            <i style={{color:'#F6BE00',fontSize:'2rem'}} className={value >=1 ? 'fas fa-star' : value >=0.5 ? 'fas fa-star-half-alt' : 'far fa-star'}></i>
        </span>
        <span>
            <i style={{color:'#F6BE00',fontSize:'2rem'}} className={value >=2 ? 'fas fa-star' : value >=1.5 ? 'fas fa-star-half-alt' : 'far fa-star'}></i>
        </span>
        <span>
            <i style={{color:'#F6BE00',fontSize:'2rem'}} className={value >=3 ? 'fas fa-star' : value >=2.5 ? 'fas fa-star-half-alt' : 'far fa-star'}></i>
        </span>
        <span>
            <i style={{color:'#F6BE00',fontSize:'2rem'}} className={value >=4 ? 'fas fa-star' : value >=3.5 ? 'fas fa-star-half-alt' : 'far fa-star'}></i>
        </span>
        <span>
            <i style={{color:'#F6BE00',fontSize:'2rem'}} className={value >=5 ? 'fas fa-star' : value >=4.5 ? 'fas fa-star-half-alt' : 'far fa-star'}></i>
        </span>
        <span style={{marginLeft:'1rem',fontSize:'2rem',fontFamily:'lato',fontWeight:'300'}}>{text && text}</span>
        {/* if text exist show text */}
      
    </span>
  )
}

RatingReview.defaultProps = {
    color:'#f8e825',
}

export default RatingReview