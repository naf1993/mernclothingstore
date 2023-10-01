import React,{useState} from 'react'
import { IconButton } from '@mui/material/IconButton'
import SearchIcon from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";


const SearchBar = ({setSearchQuery}) => {
  return (
    <form>
        <TextField id='search-bar' onInput={(e)=>setSearchQuery(e.target.value)} label='Enter Product Name' variant='outlined' placeholder='Search' size='small'/>
        <IconButton type='submit' aria-label='search'>
            <SearchIcon style={{fill:'blueviolet'}}/>
        </IconButton>

    </form>
  )
}

export default SearchBar