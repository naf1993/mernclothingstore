import React, { useState, useEffect } from "react";
import FooterContentSmallScreen from "./FooterContentSmallScreen";
import  {Link} from 'react-router-dom'
const Footer = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 500);
  const handleResize = () => {
    setIsSmallScreen(window.innerWidth < 500);
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div className="footer">
      {isSmallScreen && <FooterContentSmallScreen />}
      {!isSmallScreen && (
        <>
          <div className="footer-container">
            <div className="footer-section about">
              <h3>About Us</h3>
              <p>Learn more about our story, mission, and values.</p>
              <Link to='/about'>Read More</Link>
            </div>

            <div className="footer-section links">
              <h3>Quick Links</h3>
              <ul>
               
                <li>
                <Link to='/contact'>Contact us</Link>
                </li>
                
                <li>
                <Link to='/returnpolicy'>Return Policy</Link>
                </li>
              </ul>
            </div>

            <div className="footer-section contact">
              <h3>Contact Us</h3>
              <p>Email: modestclothing@gmail.com</p>
              <p>Phone: +1 (234) 567-890</p>
            </div>

           
          </div>
          <div className="footer-bottom">
            <p>
              &copy; {new Date().getFullYear()} ModestClothing. All rights
              reserved.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Footer;
