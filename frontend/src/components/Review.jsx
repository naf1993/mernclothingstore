import React from 'react'
import Headings from './Headings'
import SingleReview from './SingleReview';

const reviews = [
    { 
      id: 1, 
      name: "Alice", 
      text: "Amazing products! Will definitely buy again.", 
      rating: 5, 
      profileImage:'./assets/images/user.avif'
    },
    { 
      id: 2, 
      name: "Bob", 
      text: "Great customer service and fast shipping.", 
      rating: 4, 
      profileImage: './assets/images/user.avif'
    },
    { 
      id: 3, 
      name: "Charlie", 
      text: "Good quality, but a bit pricey.", 
      rating: 4, 
      profileImage: './assets/images/user.avif'
    },
    { 
      id: 4, 
      name: "Daisy", 
      text: "Absolutely love my purchase!", 
      rating: 5, 
      profileImage: './assets/images/user.avif'
    },
  ];

const Review = () => {
  return (
   <section className='customer-reviews'>
     <div className="heading">
        <Headings>What Our Customers Say</Headings>
      </div>
    <div className='reviews-container'>
        {reviews.map((review)=>(
            <SingleReview key={review.id} {...review}/>
        ))}
    </div>
   </section>
  )
}

export default Review
