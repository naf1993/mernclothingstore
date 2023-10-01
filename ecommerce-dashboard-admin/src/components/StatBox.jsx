import React from 'react'
import {Box,Typography,useTheme} from '@mui/material'
import FlexBetween from './FlexBetween'
import {styled,alpha} from '@mui/material/styles'
import { PropTypes } from 'prop-types'


const StyledIcon = styled('div')({
 
 display:'flex',
 borderRadius:'50%',
 alignItems:'center',
 width:'45px',
 height:'45px',
 justifyContent:'center',



});




const StatBox = ({title,value,increase,icon,description,color='primary'}) => {
  const theme = useTheme();
  return (
    <Box
      gridColumn="span 3"
      gridRow="span 1"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      p="1.25rem 1rem"
      flex="1 1 100%"
      backgroundColor='white'
      borderRadius="0.55rem"
    >
      <FlexBetween>
        <Typography variant="h6" sx={{ color: '#65748B' }}>
          {title}
        </Typography>
        <StyledIcon
        sx={{backgroundColor:`${color}`,color:'white'}}
       
      >
     {icon({size:20})}
      </StyledIcon>

      
      </FlexBetween>

      <Typography
        variant="h4"
        fontWeight="600"
        sx={{ color: '#121828',
        fontSize: '2rem',
        lineHeight: '1.175em' }}
      >
        {value}
      </Typography>
      <FlexBetween gap="1rem">
        <Typography
          variant="h5"
          fontStyle="italic"
          sx={{ color: `${color}` }}
        >
          {increase}
        </Typography>
        <Typography>{description}</Typography>
      </FlexBetween>
    </Box>
   
  )
}

export default StatBox

