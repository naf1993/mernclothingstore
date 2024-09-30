import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import styled from "styled-components";
import {Box} from '@mui/material'
import useOutsideClick from "../hooks/useOutsideClick";

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
const ModalContext = createContext();

function CustomModal1({ children }) {
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);

  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

function Window({ children, name }) {
  const { openName, close } = useContext(ModalContext);
  const ref = useOutsideClick(close);

  if (name !== openName) return null;

  return createPortal(
    <Overlay>
    <StyledModal ref={ref}>
      <Button onClick={close}>
        <HiXMark />
      </Button>
     
      <Box sx={{ marginTop: "2rem" }}> {/* Add margin to push the form below the close button */}
      {cloneElement(children, { onCloseModal: close })}
      </Box>
      
     
    </StyledModal>
  </Overlay>,
  document.body
  );
}

CustomModal1.Open = Open;
CustomModal1.Window = Window;

export default CustomModal1;
