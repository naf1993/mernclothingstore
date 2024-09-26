import React from 'react';
import { Grid, Box } from '@mui/material';
import { styled } from '@mui/system';

const StyledGrid = styled(Grid)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '24rem 1fr 1.2fr',
  alignItems: 'center',
  gap: '2.4rem',
  padding: '1.2rem 0',

  '&:first-child': {
    paddingTop: '0',
  },

  '&:last-child': {
    paddingBottom: '0',
  },

  '&:not(:last-child)': {
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
  },

  '&:has(button)': {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1.2rem',
  },
}));

const Label = styled('label')({
  fontWeight: 500,
});

const Error = styled('span')({
  fontSize: '1.4rem',
  color: 'var(--color-red-700)',
});

const FormRow = ({ label, error, children }) => {
  return (
    <StyledGrid container>
      {label && (
        <Box>
          <Label>{label}</Label>
        </Box>
      )}
      <Box>{children}</Box>
      {error && <Error>{error}</Error>}
    </StyledGrid>
  );
};

export default FormRow;
