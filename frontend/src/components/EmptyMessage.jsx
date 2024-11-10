import React from 'react'; // Import the SCSS file for styling

const EmptyMessage = ({ message = "No data available", className = "" }) => {
  return (
    <div className={`empty-message ${className}`}>
      <p>{message}</p>
    </div>
  );
};

export default EmptyMessage;
