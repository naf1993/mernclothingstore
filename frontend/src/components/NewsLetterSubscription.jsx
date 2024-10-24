import React, { useState } from "react";
import Headings from "./Headings";

const NewsLetterSubscription = () => {
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setErrorMessage("Please enter a valid email");
      return;
    }
    try {
      //try api call
      setSuccessMessage("Thank you for subscribing");
      setEmail("");
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("An error occured.Please try again later");
    }
  };
  return (
    <div className="newsletter">
      <div className="heading">
        <Headings>Subscribe to our newsletter</Headings>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your Email"
        />
        <button type="submit">Subscribe</button>
      </form>
      {successMessage && <p className="success">{successMessage}</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
};

export default NewsLetterSubscription;
