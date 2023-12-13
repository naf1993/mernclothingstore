import React,{useState,useRef} from "react";
import Rating from "../components/Rating";
import {gsap} from 'gsap'
import { FaAngleRight } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import Select from "react-select";

const customStyles = {
  option: (defaultStyles, state) => ({
    ...defaultStyles,
    color: state.isSelected ? "#212529" : "black",
    border: "0.01px solid #cac2c2",
    boxShadow: "none",
    fontSize:'13px',
    fontWeight:'400',
    letterSpacing:'0.1rem',
    backgroundColor: state.isSelected ? "#cac2c2" : "white",
    fontFamily:'lato'
    
  }),
  dropdownIndicator: styles => ({ 
    ...styles, 
    color: 'rgb(95, 89, 89)', 
  }),

  control: (defaultStyles) => ({
    ...defaultStyles,
    backgroundColor: "#fff",
    color:'rgb(95, 89, 89)',
    marginTop:'1rem',
   
    border: "0.2px solid #cac2c2",
    boxShadow: "none",
    fontSize:'13px',
    fontWeight:'400',
    letterSpacing:'0.1rem',
    fontFamily:'lato'
   
  }),
  singleValue: (defaultStyles) => ({ ...defaultStyles, color: "black" }),
};



const MobileScreenDetails =({colors,onHandleColor}) => {
  const [openAccordion, setOpenAccordion] = useState(null);
 
  const accordionRefs = useRef([]);

  const handleAccordion = (index) => {
    if (index === openAccordion) {
      gsap.to(
        accordionRefs.current[index].querySelector(".accord-details"),
        {
          height: 0,
          duration: .3,
          ease: "power1.inOut",
          onComplete: () => setOpenAccordion(null),
        }
      );
      // console.log(openAccordion);
    } else {
      if (openAccordion !== null) {
        gsap.to(
          accordionRefs.current[openAccordion].querySelector(
            ".accord-details"
          ),
          {
            height: 0,
            duration: .3,
            ease: "power1.inOut",
          }
        );
      }
      setOpenAccordion(index);
      gsap.fromTo(
        accordionRefs.current[index].querySelector(".accord-details"),
        { height: 0 },
        {
          height: "auto",
          duration: .3,
          ease: "power1.inOut",
        }
      );
    }
  }
  return (
    <>
     
        <div className="accord-container">
        <div className={`accord-item ${openAccordion === 0 ? 'open':''}`}  ref={(el) => (accordionRefs.current[0] = el)}>
          {colors && (
            <div className="accord-header" onClick={()=>handleAccordion(0)}>
              <h4 className="product-color">COLORS</h4>
              <FaAngleRight className="accord-arrow"/> 
             
            </div>
          )}
          {colors && (
            <div className="accord-details">
              <div className="buttons-wrapper">
                {colors?.map((color, index) => (
                  <span key={index} className="filter-color-btn">
                    <button
                      value={color}
                      onClick={() => onHandleColor(color)}
                      type="submit" 
                      style={{
                        backgroundColor: `${color}`,
                      }}
                    />
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
       
        <div  ref={(el) => (accordionRefs.current[2] = el)} className={`accord-item ${openAccordion === 2 ? 'open':''}`}>
          <div className="accord-header" onClick={()=>handleAccordion(2)}>
            <h4 className="product-details">Product Details</h4>
          <FaAngleRight className="accord-arrow"/> 
          </div>
          <div className="accord-details">
            <p>Product Details: 8834941</p>
            <p>Return within "30 days". For detailed information, Click.</p>
            <p>Fabric Info: 100% BARKCLOTH</p>
          </div>
        </div>

        
        </div>
       
       
       
    </>
  );
};

export default MobileScreenDetails;
