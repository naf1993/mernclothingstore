import { CART_ADD_ITEM, CART_REMOVE_ITEM } from "../constants/cartConstants";

const initialState = {
  cartItems: [],
  
};

const saveToLocalStorage = (cartItems) => {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
 
};

export const addToCartReducer = (state = initialState, action) => {
  switch (action.type) {
    case CART_ADD_ITEM:
      const item = action.payload;
      const existItem = state.cartItems.find(
        (x) => x.product === item.product && x.color === item.color && x.size === item.size
      );

      let updatedCartItems;
      if (existItem) {
        updatedCartItems = state.cartItems.map((x) =>
          x.product === existItem.product && x.color === existItem.color && x.size === existItem.size
            ? item
            : x
        );
      } else {
        updatedCartItems = [...state.cartItems, item];
      }

      // Save to local storage
      saveToLocalStorage(updatedCartItems);

      return {
        ...state,
        cartItems: updatedCartItems,
      };

    case CART_REMOVE_ITEM:
      const filteredCartItems = state.cartItems.filter((el) => el.product !== action.payload);

      // Save to local storage
      saveToLocalStorage(filteredCartItems);

      return {
        ...state,
        cartItems: filteredCartItems,
      };

    default:
      return state;
  }
};