import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import styled from "styled-components";
import { forwardRef, useEffect } from "react";
import { Box } from "@mui/material";

const StyledModal = styled(Box)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 600px;
  background-color: ${({ theme }) => theme.palette.primary.main};
  border-radius: 8px;
  box-shadow: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.12);
  padding: 2rem;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 1000;
   display: flex;
  flex-direction: column; 
`;

const Overlay = styled(Box)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 900;
`;
const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: 5px;
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 0.4rem;
  right: 1rem;
  z-index:1100;

  &:hover {
    background-color: #f3f4f6;
  }

  & svg {
    width: 2rem;
    height: 2rem;
    color: #6b7280;
  }
`;

const CustomModal = forwardRef(({ children, onClose }, ref) => {
  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // Close modal on overlay click
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <Overlay onClick={handleOverlayClick}>
      <StyledModal ref={ref}>
        <Button onClick={onClose}>
          <HiXMark />
        </Button>
       
        <Box sx={{ marginTop: "3rem" }}> {/* Add margin to push the form below the close button */}
          {children}
        </Box>
        
       
      </StyledModal>
    </Overlay>,
    document.body
  );
});

export default CustomModal;
