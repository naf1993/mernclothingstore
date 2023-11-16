import { PRODUCT_LIST_SUCCESS } from "../constants/productConstants";
import { PRODUCT_LIST_FAIL } from "../constants/productConstants";
import { PRODUCT_LIST_REQUEST } from "../constants/productConstants";
import { PRODUCT_DETAIL_REQUEST } from "../constants/productConstants"
import { PRODUCT_DETAIL_SUCCESS } from "../constants/productConstants"
import { PRODUCT_DETAIL_FAIL } from "../constants/productConstants"


import axios from 'axios';

export const listProducts = ()=>  async(dispatch)=>{
    try{
        dispatch({type:PRODUCT_LIST_REQUEST})
        const {data} = await axios.get('/api/products')
      
        const allProducts = data.data.products
               dispatch({
            type:PRODUCT_LIST_SUCCESS,
            payload:allProducts
        })

    }catch(error){
        dispatch({
            type:PRODUCT_LIST_FAIL,
            payload:error.response.data.message
        })

    }

}

export const listProductDetails = (id)=>  async(dispatch)=>{
    try{
        dispatch({type:PRODUCT_DETAIL_REQUEST})
        const {data} = await axios.get(`/api/products/${id}`)
       
       

        dispatch({
            type:PRODUCT_DETAIL_SUCCESS,
            payload:data.data.product
        })
        
    }catch(error){
        dispatch({
            type:PRODUCT_DETAIL_FAIL,
            payload:error.response.data.message
        })

    }

}

