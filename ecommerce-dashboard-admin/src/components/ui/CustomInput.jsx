import React from "react";
import { TextField, InputLabel, FormControl } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledTextField = styled(TextField)`
  margin-bottom: 1rem;
`;




// const StyledLabel = styled(InputLabel)(({ theme }) => ({
//   marginBottom: ".7rem",
//   color: theme.palette.primary.main,
// }));

const CustomInput = React.forwardRef(({ type,label, error, helperText, ...rest }, ref) => {
  return (
   
    
      <StyledTextField type={type} label={label}
        inputRef={ref} // Attach ref to the TextField
        error={Boolean(error)}
        helperText={error || helperText}
        variant="outlined"
        fullWidth
        {...rest}
      />
   
  );
});

export default CustomInput;
