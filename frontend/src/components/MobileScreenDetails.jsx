import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { FaAngleRight } from "react-icons/fa";
import Select from "react-select";

const customStyles = {
  option: (defaultStyles, state) => ({
    ...defaultStyles,
    color: state.isSelected ? "#212529" : "black",
    border: "0.01px solid #cac2c2",
    boxShadow: "none",
    fontSize: "13px",
    fontWeight: "400",
    letterSpacing: "0.1rem",
    backgroundColor: state.isSelected ? "#cac2c2" : "white",
    fontFamily: "lato",
  }),
  dropdownIndicator: (styles) => ({
    ...styles,
    color: "rgb(95, 89, 89)",
  }),
  control: (defaultStyles) => ({
    ...defaultStyles,
    backgroundColor: "#fff",
    color: "rgb(95, 89, 89)",
    marginTop: "1rem",
    border: "0.2px solid #cac2c2",
    boxShadow: "none",
    fontSize: "13px",
    fontWeight: "400",
    letterSpacing: "0.1rem",
    fontFamily: "lato",
  }),
  singleValue: (defaultStyles) => ({ ...defaultStyles, color: "black" }),
};

const MobileScreenDetails = ({
  onSizeChange,
  sizeOptions,
  colors,
  onHandleColor,
  ifSize,
  setColorErr,
  setSizeErr,
  colorErr,
  sizeErr,
  productDetails,description
}) => {


  const [openAccordion, setOpenAccordion] = useState(null);
  const accordionRefs = useRef([]);

  const handleAccordion = (index) => {
    if (index === openAccordion) {
      gsap.to(accordionRefs.current[index].querySelector(".accord-details"), {
        height: 0,
        duration: 0.3,
        ease: "power1.inOut",
        onComplete: () => setOpenAccordion(null),
      });
    } else {
      if (openAccordion !== null) {
        gsap.to(
          accordionRefs.current[openAccordion].querySelector(".accord-details"),
          {
            height: 0,
            duration: 0.3,
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
          duration: 0.3,
          ease: "power1.inOut",
        }
      );
    }
  };

  return (
    <>
      <div className="accord-container">
        {colors && (
          <div
            className={`accord-item ${openAccordion === 0 ? "open" : ""}`}
            ref={(el) => (accordionRefs.current[0] = el)}
          >
            <div className="accord-header" onClick={() => handleAccordion(0)}>
              <h4 className="product-color">COLORS</h4>
              <FaAngleRight className="accord-arrow" />
            </div>
            <div className="accord-details">
              <div className="buttons-wrapper">
                {colors.map((color, index) => (
                  <span key={color} className="filter-color-btn">
                    <button
                      onClick={() => onHandleColor(color)}
                      value={color}
                      type="button" // Changed to button to avoid form submission
                      style={{
                        backgroundColor: color,
                      }}
                    />
                  </span>
                ))}
              </div>
            </div>
            {colorErr && <p className="text-danger">{colorErr}</p>}
          </div>
        )}

        <div
          ref={(el) => (accordionRefs.current[1] = el)}
          className={`accord-item ${openAccordion === 1 ? "open" : ""}`}
        >
          <div className="accord-header" onClick={() => handleAccordion(1)}>
            <h4 className="product-details">Product Details</h4>
            <FaAngleRight className="accord-arrow" />
          </div>
          <div className="accord-details">
            <p>{description}</p>
            <p>Fabric Info : Pure Cotton</p>
           
          </div>
        </div>
      </div>

      {ifSize && (
        <Select
          isClearable={true}
          options={sizeOptions}
          onChange={onSizeChange}
          styles={customStyles}
        />
      )}
      {sizeErr && <p className="text-danger">{sizeErr}</p>}
    </>
  );
};

export default MobileScreenDetails;
