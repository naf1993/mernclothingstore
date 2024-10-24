import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools} from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import {persistStore,persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { customizationReducer, themeReducer } from "./reducers/themeReducer";
import { adminLoginReducer,userListReducer, userUpdateByAdminReducer } from "./reducers/userReducer";
import { productCreateReducer,productDeleteReducer,productDetailReducer,productImageDeleteReducer,productListReducer,productUpdateReducer } from "./reducers/productReduceer";
import { dashboardStatsReducer } from "./reducers/dashboardStatsReducer";
import notificationReducer from "reducers/notificationReducer";
import { orderReducer } from "reducers/orderReducer";
import { bulkActionReducer } from "reducers/bulkActionReducer";
const reducer = combineReducers({
    theme:themeReducer,
    customization:customizationReducer,
    userLogin:adminLoginReducer,
    productList:productListReducer,
    productDetails:productDetailReducer,
    productCreate:productCreateReducer,
    editProduct:productUpdateReducer,
    deleteProduct:productDeleteReducer,
    deleteProductImage:productImageDeleteReducer,
    userList:userListReducer,
    userUpdateAdmin:userUpdateByAdminReducer,
    dashboardStats:dashboardStatsReducer,
    allnotifications:notificationReducer,
    order:orderReducer,
    bulkAction:bulkActionReducer
   
})
const persistConfig = {
    key:'root',
    version:1,
    storage,
    
}
const persistedReducer = persistReducer(persistConfig,reducer)

const userInfoFromStorage = localStorage.getItem('userInfo')

const initialState = {
    userLogin:{
        userInfo:userInfoFromStorage,
       
    }

}
const middleware = composeWithDevTools(applyMiddleware(thunk))
const store = createStore(persistedReducer,initialState,middleware)
const persistor = persistStore(store)
export default store
export {persistor}