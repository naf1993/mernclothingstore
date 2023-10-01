import React from 'react'
import { Typography,Box,useTheme } from '@mui/material'

const Header = ({title,subtitle}) => {
    const theme = useTheme()
  return (
   <Box>
     <Typography
        variant="h4"
        color={theme.palette.secondary[400]}
        fontWeight="bold"
        sx={{ mb: "5px" }}
      >
        {title}
      </Typography>
      <Typography variant="h6" color={theme.palette.secondary[300]}>
        {subtitle}
      </Typography>
   </Box>
  )
}

export default Header