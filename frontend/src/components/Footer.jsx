import React, { useState } from "react";

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
      {!isSmallScreen && <div></div>}
    </div>
  );
};

export default Footer;
