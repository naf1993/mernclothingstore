import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { composeWithDevTools } from 'redux-devtools-extension';
import { productReducer } from './reducers/productReducer';
import { authReducer } from './reducers/authReducer';
import { addToCartReducer } from './reducers/cartReducer';
import { modalReducer } from './reducers/productModalReducer';

const rootReducer = combineReducers({
    product: productReducer,
    auth: authReducer,
    cart: addToCartReducer,
    productModal: modalReducer,
});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'cart'], // Persisting only auth and cart
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
