import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import Announcement from "./components/Announcement";

import { useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Register from "./screens/Register";
import Favourites from "./screens/Favourites";
import Cart from "./screens/Cart";
import ProductList from "./screens/ProductList";
import Cookies from 'js-cookie'
import Loader from "./components/Loader";
import "react-multi-carousel/lib/styles.css";
import { useEffect } from "react";
import axios from "axios";
import SingleProduct from "./screens/SingleProduct";
import { loginUserWithOauth,loadUser } from "./actions/authActions";
import SearchScreen from "./screens/SearchScreen";
import ProductDetail from "./screens/ProductDetail";


const App = () => {
  const [navItems, setNavItems] = useState([]);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { token,appLoaded,isLoading,isAuthenticated,user,error } = auth;

  
  useEffect(() => {
    if (window.location.hash === '#_=_') window.location.hash = '';

    const cookieJwt = Cookies.get('x-auth-cookie');
   
    if (cookieJwt) {

      dispatch(loginUserWithOauth(cookieJwt))
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
  }, [auth.isAuthenticated, auth.token, loadUser, auth.isLoading, auth.appLoaded]);

  return (
  
       <Router>
       <div className="wrapper">
         <NavBar navItems={navItems} />
 
         <Routes>
           <Route path="/" element={<Home />} exact />
           <Route path="/products/:category/:id" element={<ProductList categories={navItems} />} />
           <Route path="/products/:id" element={<SingleProduct />} />
           <Route path="/login" element={<Login />} />
           <Route path='/search' element={<SearchScreen/>}/>
           <Route path="/register" element={<Register />} />
           <Route path="/favourites" element={<Favourites />} />
           <Route path="/cart" element={<Cart />} />
         </Routes>
         {/* <Footer/> */}
       </div>
     </Router>
   
  );
};
export default App;
