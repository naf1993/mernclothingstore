import React from 'react'
import { useState,useEffect } from 'react'
import {Box,CircularProgress,Fab} from '@mui/material'
import {Check,Save} from '@mui/icons-material'
import {green} from '@mui/material/colors'
import {updateUserStatusByAdmin} from '../actions/userActions'
import { useDispatch, useSelector } from 'react-redux';

const CustomerActions = ({params,rowId,setRowId}) => {
    const [loading,setLoading] = useState(false)
    const [success,setSuccess] = useState(false)
    const dispatch = useDispatch();
    const handleSubmit = async()=>{
        console.log(params.id)
        setLoading(true)
        const {active} = params.row
        console.log(active)
      dispatch(updateUserStatusByAdmin({_id:params.id,active}))
      setSuccess(true)
      setRowId(null)
      setLoading(false)
    }
    useEffect(()=>{
      if(rowId === params.id && success) setSuccess(false)
    },[rowId])
  return (
    <Box sx={{m:1,position:'relative'}}>
    {success ? (
        <Fab  color="primary"
        sx={{
          width: 40,
          height: 40,
          bgcolor: green[500],
          '&:hover': { bgcolor: green[700] },
        }}><Check/></Fab>
    ):(
        <Fab  color="primary"
        sx={{
          width: 40,
          height: 40,
        }}
        disabled={params.id !== rowId || loading}
        onClick={handleSubmit}>
            <Save/>
        </Fab>
    )}
    {loading && (
          <CircularProgress
          size={52}
          sx={{
            color: green[500],
            position: 'absolute',
            top: -6,
            left: -6,
            zIndex: 1,
          }}
        />
    )}

    </Box>
  )
}

export default CustomerActions