import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { composeWithDevTools } from 'redux-devtools-extension';
import { productReducer } from './reducers/productReducer';
import { authReducer } from './reducers/authReducer';
import { addToCartReducer } from './reducers/cartReducer';
import { modalReducer } from './reducers/productModalReducer';
import { userReducer } from './reducers/userReducer';

const rootReducer = combineReducers({
    product: productReducer,
    auth: authReducer,
    cart: addToCartReducer,
    productModal: modalReducer,
    user:userReducer
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'cart','user'], // Persisting auth cart user
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleware = [thunk];

const store = createStore(
    persistedReducer,
    composeWithDevTools(applyMiddleware(...middleware))
);

 const persistor = persistStore(store);

export default store
export {persistor}
