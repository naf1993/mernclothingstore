import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    darkMode:!!JSON.parse(localStorage.getItem("darkMode"))
}

export const themeSlice = createSlice({
    name:'theme',
    initialState,
    reducers:{
        toggleTheme:(state)=>{
            state.darkMode = !state.darkMode
        }
    }
})

export const asyncToggleTheme = ()=>(dispatch)=>{
    const isDarkmode = !!JSON.parse(localStorage.getItem('darkMode'))
    localStorage.setItem('darkMode',!isDarkmode)
    dispatch(toggleTheme())
}

export const {toggleTheme} = themeSlice.actions

export default themeSlice.reducer