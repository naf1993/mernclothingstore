import React, { forwardRef } from 'react';
import styled from 'styled-components';

const HiddenInput = styled.input.attrs({ type: 'file' })`
  display: none; /* Hide the default input */
`;

const CustomInputLabel = styled.label`
  font-size: .8rem;
  border-radius: 5px;
  padding: 0.8rem .5rem;
  margin-right: 1.2rem;
  border: none;
  color: ${({ theme }) => theme.palette.primary.main};
  background-color: ${({ theme }) => theme.palette.green.light};
  cursor: pointer;
  transition: color 0.2s, background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.palette.green.main};
  }
`;

const CustomFileInput = forwardRef(({ onChange, id, label }, ref) => {
  return (
    <>
      <HiddenInput id={id} onChange={onChange} ref={ref} />
      <CustomInputLabel htmlFor={id}>{label}</CustomInputLabel>
    </>
  );
});

export default CustomFileInput;
