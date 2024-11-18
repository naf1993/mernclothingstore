import React from 'react'; // Import the SCSS file for styling

const EmptyMessage = ({ message = "No data available", className = "" }) => {
  return (
    <div className={`empty-message ${className}`}>
      <h4>{message}</h4>
    </div>
  );
};

export default EmptyMessage;
