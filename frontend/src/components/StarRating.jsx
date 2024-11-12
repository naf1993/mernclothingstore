import React from "react";
import { BsFillStarFill, BsStarHalf } from "react-icons/bs";

const StarRating = ({ rating }) => {
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    for (let i = 0; i < fullStars; i++) {
      stars.push(<BsFillStarFill key={`full-${i}`} className="star" style={{color:'#E4B400',fontSize:'1.3rem'}} />);
    }
    if (hasHalfStar) {
      stars.push(<BsStarHalf key="half" className="star" />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(
        <BsFillStarFill
          key={`empty-${i}`}
          className="star"
          style={{ color: "#fff",fontSize:'1.3rem' }}
        />
      );
    }
    return stars;
  };

  return (
   <span style={{display:'flex',alignItems:'flex-start',justifyContent:'start'}}>{renderStars()}</span>
   );
};

export default StarRating;
