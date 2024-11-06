import toast from "react-hot-toast";
import axios from 'axios'
import { ORDER_CREATE_FAIL, ORDER_CREATE_REQUEST, ORDER_CREATE_SUCCESS } from "../constants/orderConstants";


export const createNewOrder = (orderData) => async (dispatch, getState) => {
    try {
      dispatch({ type: ORDER_CREATE_REQUEST });
      const {
        user: { token, isAuthenticated },
      } = getState();

      if (!isAuthenticated || !token) {
        throw new Error("User not logged in");
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post("/api/orders",orderData, config);
      console.log(data.data.order);
      toast.success('New Order Placed')
  
      dispatch({ type: ORDER_CREATE_SUCCESS, payload: data.data.orders });
    } catch (error) {
      dispatch({ type: ORDER_CREATE_FAIL, payload: error.response.data.message });
    }
  };