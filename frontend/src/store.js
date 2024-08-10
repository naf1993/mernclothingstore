import { applyMiddleware, combineReducers, createStore,compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { modalReducer } from "./reducers/productModalReducer.js";
import { addToCartReducer } from "./reducers/cartReducer.js";
import {
  productDetailReducer,
  productListReducer,
} from "./reducers/productReducer";
import { authReducer } from "./reducers/authReducer.js";
const reducer = combineReducers({
  auth: authReducer,
  productModal: modalReducer,
  cart: addToCartReducer,

  productList: productListReducer,
  productDetails: productDetailReducer,
});
const persistConfig = {
  key: "root",
  whitelist: ["auth"],
  version: 1,
  storage,
};
const persistedReducer = persistReducer(persistConfig, reducer);

// const getFromLocalStorage = (key)=>{
//   if(!key || typeof window === 'undefined'){
//     return ''
//   }
//   return localStorage.getItem(key)
// }

const cartItemsFromStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []
const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')) : {}

const initialState = {
    cart:{cartItems:cartItemsFromStorage,shippingAddress:shippingAddressFromStorage}
};

const middleware = composeWithDevTools(applyMiddleware(thunk));
const store = createStore(persistedReducer, initialState, middleware);
const persistor = persistStore(store);
export default store;
export { persistor };
