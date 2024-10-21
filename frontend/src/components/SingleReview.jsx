import React from 'react'

const SingleReview = ({ name, text, rating, profileImage }) => {
  return (
    <div className="review-card">
    <div className="review-header">
      <img className="profile-image" src={profileImage} alt={`${name}'s profile`} />
      <div className="review-rating">{"⭐".repeat(rating)}</div>
    </div>
    <h3 className="reviewer-name">{name}</h3>
    <p className="review-text">{text}</p>
  </div>
  )
}

export default SingleReview
