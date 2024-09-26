import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import styled from "styled-components";
import { forwardRef } from "react";

const StyledModal = styled.div`
  position: fixed;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 9px;
  box-shadow: 0 2.4rem 3.2rem rgba(0, 0, 0, 0.12);
  padding: 2rem 2rem;
  transition: all 0.5s;
  max-height: 60vh; /* Limit max height */
  
  overflow-y: auto;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: 5px;
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: .4rem;
  right: 1rem;

  &:hover {
    background-color: #f3f4f6;
  }

  & svg {
    width: 2rem;
    height: 2rem;
    /* Sometimes we need both */
    /* fill:  #6b7280;
    stroke:  #6b7280; */
    color:  #6b7280;
  }
`;

const CustomModal = forwardRef(({ children, onClose }, ref) => {
  return createPortal(
    <Overlay>
      <StyledModal ref={ref}>
        <Button onClick={onClose}>
          <HiXMark />
        </Button>
        <div>{children}</div>
      </StyledModal>
    </Overlay>,
    document.body
  );
});

export default CustomModal
