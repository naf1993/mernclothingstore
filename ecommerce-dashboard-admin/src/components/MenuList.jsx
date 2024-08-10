import React from 'react'
import menuItems from 'menu-items'
import { Typography } from '@mui/material'
import NavGroup from './NavGroup'


const MenuList = () => {
    const navItems = menuItems.items.map((item)=>{
        switch(item.type){
            case 'group':
             return <NavGroup key={item.id} item={item}/>
            default:
                return (
                    <Typography key={item.id} variant='h6' color='red' align='center'>
                        Menu items error
                    </Typography>
                )
        }
    })
    return <>{navItems}</>
}

export default MenuList