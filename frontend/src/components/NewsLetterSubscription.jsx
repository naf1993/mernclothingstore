import React, { useState } from "react";
import Headings from "./Headings";
import toast from "react-hot-toast";
import axios from "axios";
import {apiUrl} from "../actions/apiUrl.js";

const NewsLetterSubscription = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      const config = {
        headers:{
          'Content-Type':'application/json'
        }
      }
      const { data } = await axios.post(`${apiUrl}/api/subscription/subscribe`,{email},config);
      console.log(data)

      toast.success(data.message);
      setEmail("");
    
    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message);
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
    
    </div>
  );
};

export default NewsLetterSubscription;
