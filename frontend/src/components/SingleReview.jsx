const SingleReview = ({ name, text, rating }) => {
  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-rating">{"⭐".repeat(rating)}</div>
      </div>
      <h3 className="reviewer-name">{name}</h3>
      <p className="review-text">{text}</p>
    </div>
  );
};

export default SingleReview;
