import React from "react";
import RatingReview from "./RatingReview";
import Rating from "./Rating";
import moment from "moment";
import StarRating from "./StarRating";

const ReviewsList = ({ product}) => {
  const {reviews} = product
  return (
    <>
      <div className="reviews-summary">
       
        <StarRating rating={product.ratingsAverage} text={""} />
        {product.ratingsQuantity > 1 && ( <h3 className="ratings-number">{`${product.ratingsQuantity} reviews`}</h3>)}
        {product.ratingsQuantity <=1 && (<h3 className="ratings-number">{`${product.ratingsQuantity} review`}</h3>)}       
       
      </div>
      <div className="reviews-wrapper">
        {reviews?.map((review, index) => (
          <div key={index} className="single-review">
            <div>
              <h4 className="review-user">{review.user.name}</h4>
              <StarRating rating={review.rating} />

              <h3 className="review-date">{new Date(review.createdAt).toLocaleDateString()}</h3>
            </div>

            <p className="review-details">{review.review}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default ReviewsList;
