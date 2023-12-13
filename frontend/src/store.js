import {applyMiddleware,combineReducers,createStore} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import {persistStore,persistReducer,FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {modalReducer} from './reducers/productModalReducer.js'
import {addToCartReducer} from './reducers/cartReducer.js'
import { productDetailReducer,productListReducer } from "./reducers/productReducer";
import { authReducer } from './reducers/authReducer.js'
const reducer = combineReducers({
    auth:authReducer,
    productModal:modalReducer,
    cartAdd:addToCartReducer,

  
    productList:productListReducer,
    productDetails:productDetailReducer,

})
const persistConfig = {
    key:'root',
    whitelist:['auth'],
    version:1,
    storage,
    
}
const persistedReducer = persistReducer(persistConfig,reducer)


const initialState = {}
const middleware = composeWithDevTools(applyMiddleware(thunk))
const store = createStore(persistedReducer,initialState,middleware)
const persistor = persistStore(store)
export default store
export {persistor}