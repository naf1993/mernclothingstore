import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "./components/Layout";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Favourites from "./screens/Favourites";
import Cart from "./screens/Cart";
import ProductList from "./screens/ProductList";
import Cookies from "js-cookie";
import "react-multi-carousel/lib/styles.css";
import { useEffect } from "react";
import axios from "axios";
import SingleProduct from "./screens/SingleProduct";
import { loginUserWithOauth, loadUser } from "./actions/authActions";
import SearchScreen from "./screens/SearchScreen";
import ProductDetail from "./screens/ProductDetail";
import LoadingFullScreen from "./components/LoadingFullScreen";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  const [loading,setLoading] = useState(true)
  const [navItems, setNavItems] = useState([]);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { token, appLoaded, isLoading, isAuthenticated, user, error } = auth;
useEffect(()=>{
  const timer = setTimeout(()=>{
    setLoading(false)
  },2000)
  return()=>clearTimeout(timer)
},[])

  useEffect(() => {
    if (window.location.hash === "#_=_") window.location.hash = "";

    const cookieJwt = Cookies.get("x-auth-cookie");

    if (cookieJwt) {
      dispatch(loginUserWithOauth(cookieJwt));
      //Cookies.remove('x-auth-cookie');
    }
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await axios.get("http://localhost:5000/api/categories");
      const categories = data.data.categories;
      setNavItems(categories);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!appLoaded && !isLoading && token && !isAuthenticated) {
      loadUser();
    }
  }, [
    auth.isAuthenticated,
    auth.token,
    loadUser,
    auth.isLoading,
    auth.appLoaded,
  ]);
  if(loading){
    return <LoadingFullScreen/>
  }

  return (
    <Router>
      <ScrollToTop/>
  
        <Routes>
        <Route path="/" element={<Layout navItems={navItems} />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="products/:category/:id" element={<ProductList />} />
          <Route path="products/:id" element={<SingleProduct />} />
          <Route path="search" element={<SearchScreen />} />
          <Route path="favourites" element={<Favourites />} />
          <Route path="cart" element={<Cart />} />
        </Route>
        </Routes>
       
     
    </Router>
  );
};
export default App;
