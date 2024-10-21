import { applyMiddleware, combineReducers, createStore, compose } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import {
  persistStore,
  persistReducer,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { modalReducer } from "./reducers/productModalReducer.js";
import { addToCartReducer } from "./reducers/cartReducer.js";
import { authReducer } from "./reducers/authReducer.js";
import { productReducer } from "./reducers/productReducer.js";

const reducer = combineReducers({
  auth: authReducer,
  productModal: modalReducer,
  cart: addToCartReducer,
  product: productReducer,
});

const persistConfig = {
  key: "root",
  whitelist: ["auth", "cart"], // Persist both auth and cart
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducer);

const cartItemsFromStorage = localStorage.getItem('cartItems') 
  ? JSON.parse(localStorage.getItem('cartItems')) 
  : [];
const shippingAddressFromStorage = localStorage.getItem('shippingAddress') 
  ? JSON.parse(localStorage.getItem('shippingAddress')) 
  : {};

const initialState = {
  cart: { cartItems: cartItemsFromStorage, shippingAddress: shippingAddressFromStorage },
};

const middleware = composeWithDevTools(applyMiddleware(thunk));
const store = createStore(persistedReducer, initialState, middleware);
const persistor = persistStore(store);

export default store;
export { persistor };
