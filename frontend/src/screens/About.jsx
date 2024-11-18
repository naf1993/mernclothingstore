import React from "react";

const aboutContent = {
  title: "About Us",
  description: `Welcome to our online store! We are dedicated to providing high-quality products 
    at affordable prices, with exceptional customer service. Our mission is to make shopping easy, 
    convenient, and enjoyable for everyone. Whether you're looking for fashion, tech, or home essentials, 
    we have something for you.`,
  mission: `Our mission is simple: offer top-quality products, ensure fast delivery, and provide 
    unparalleled customer support. We strive to be the go-to destination for all your shopping needs.`,
  vision: `We envision a world where customers have access to a wide range of products, 
    delivered quickly, and where every transaction feels effortless and secure.`,
  values: ["Customer First", "Integrity", "Innovation", "Sustainability"],
};

const About = () => {
  return (
    <div className="page-container">
      <div className="about-wrapper">
        <h1>{aboutContent.title}</h1>
        <p>{aboutContent.description}</p>

        <h2>Our Mission</h2>
        <p>{aboutContent.mission}</p>

        <h2>Our Vision</h2>
        <p>{aboutContent.vision}</p>

        <h2>Our Values</h2>
        <ul>
          {aboutContent.values.map((value, index) => (
            <li key={index}>{value}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default About;
