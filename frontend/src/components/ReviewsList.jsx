import React from "react";
import RatingReview from "./RatingReview";
import Rating from "./Rating";
import moment from "moment";

const ReviewsList = ({ product, reviews }) => {
  return (
    <>
      <div className="reviews-summary">
        <h2 className="ratings">{product.ratingsAverage}</h2>
        <RatingReview value={product.ratingsAverage} text={""} />
        <h3 className="ratings-number">{`${product.ratingsQuantity} reviews`}</h3>
      </div>
      <div className="reviews-wrapper">
        {reviews.map((review, index) => (
          <div key={index} className="single-review">
            <div>
              <h4 className="review-user">{review.user.name}</h4>
              <Rating value={review.rating} text={""} />

              <h3 className="review-date">{new Date(review.createdAt).toLocaleDateString()}</h3>
            </div>

            <p>{review.review}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default ReviewsList;
