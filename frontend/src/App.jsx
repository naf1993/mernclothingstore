import React, { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Layout from "./components/Layout";
import LoadingFullScreen from "./components/LoadingFullScreen";
import ScrollToTop from "./components/ScrollToTop";
import Cookies from "js-cookie";
import { loginUserWithOauth, loadUser } from "./actions/userActions";
import axios from "axios";
import Protected from "./components/Protected";
import {Toaster} from 'react-hot-toast'

// Lazy load screens
const Home = lazy(() => import("./screens/Home"));
const Login = lazy(() => import("./screens/Login"));
const Register = lazy(() => import("./screens/Register"));
const Favourites = lazy(() => import("./screens/Favourites"));
const Cart = lazy(() => import("./screens/Cart"));
const ProductList = lazy(() => import("./screens/ProductList"));
const SingleProduct = lazy(() => import("./screens/SingleProduct"));
const SearchScreen = lazy(() => import("./screens/SearchScreen"));
const PlaceOrder = lazy(()=>import('./screens/PlaceOrder'))
const Orders = lazy(()=>import('./screens/Orders'))
const OrderDetail = lazy(()=>import('./screens/OrderDetail'))
const OrderSucess = lazy(()=>import('./screens/OrderSuccess'))

const App = () => {
  const [loading, setLoading] = useState(true);
  const [navItems, setNavItems] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { token, appLoaded, isLoading, isAuthenticated } = user;

  useEffect(() => {
    const fetchCategoriesAndUser = async () => {
      try {
        // Fetch categories
        const { data } = await axios.get("http://localhost:5000/api/categories");
        setNavItems(data.data.categories);

        // Check for JWT cookie and log in user
        const cookieJwt = Cookies.get("x-auth-cookie");
        if (cookieJwt) {
          dispatch(loginUserWithOauth(cookieJwt));
        }

        // Load user if needed
        if (!appLoaded && !isLoading && token && !isAuthenticated) {
          await dispatch(loadUser());
        }
      } catch (error) {
        console.error("Error fetching categories or user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndUser();
  }, [dispatch, appLoaded, isLoading, token, isAuthenticated]);

  if (loading) {
    return <LoadingFullScreen />;
  }

  return (
    <>
     <Router>
      <ScrollToTop />
      <Suspense fallback={<LoadingFullScreen />}>
        <Routes>
          <Route path="/" element={<Layout navItems={navItems} />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="products/:category/:id" element={<ProductList />} />
            <Route path="products/:id" element={<SingleProduct/>} />
            <Route path="search" element={<SearchScreen />} />
            <Route path="favourites" element={<Protected><Favourites/></Protected>}/>
            <Route path="cart" element={<Cart />} />
            <Route path="placeorder" element={<Protected><PlaceOrder/></Protected>}/>
            <Route path='orders' element={<Protected><Orders/></Protected>}/>
            <Route path='ordersuccess' element={<Protected><OrderSucess/></Protected>}/>
            <Route path='orders/:id' element={<Protected><OrderDetail/></Protected>}/>
            
          </Route>
        </Routes>
      </Suspense>
    </Router>
    <Toaster
        position="bottom-right"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "#fff",
            color: "#374151",
          },
        }}
      />
    </>
   
  );
};

export default App;
