import React, { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Layout from "./components/Layout";
import LoadingFullScreen from "./components/LoadingFullScreen";
import ScrollToTop from "./components/ScrollToTop";
import Cookies from "js-cookie";
import { loginUserWithOauth, loadUser } from "./actions/userActions";
import axios from "axios";
import Protected from "./components/Protected";
import toast, { Toaster } from "react-hot-toast";
import About from "./screens/About";
import ReturnPolicy from "./screens/ReturnPolicy";
import Contact from "./screens/Contact";
import AccountPage from "./screens/AccountPage";
import ProductList1 from "./screens/ProductList1";
import { apiUrl } from "./actions/apiUrl";
import UpdateProfile from "./screens/UpdateProfile";
import SubCategories from "./screens/SubCategories";
import { LOGIN_WITH_OAUTH_SUCCESS } from "./constants/userConstant";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

// Lazy load screens
const Home = lazy(() => import("./screens/Home"));
const Login = lazy(() => import("./screens/Login"));
const Register = lazy(() => import("./screens/Register"));
const Favourites = lazy(() => import("./screens/Favourites"));
const Cart = lazy(() => import("./screens/Cart"));
const SingleProduct = lazy(() => import("./screens/SingleProduct"));

const PlaceOrder = lazy(() => import("./screens/PlaceOrder"));
const OrdersPage = lazy(() => import("./screens/OrdersPage"));

const OrderSucess = lazy(() => import("./screens/OrderSuccess"));

const App = () => {
  const [loading, setLoading] = useState(true);
  const [navItems, setNavItems] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const { isLoading, isAuthenticated } = user;

  useEffect(() => {
    console.log('entering useffect')
    const checkUserStatus = async () => {
      try {
        if (!isAuthenticated && !isLoading) {
          console.log('is authenticated',isAuthenticated)
          console.log('is loading',isLoading)
          dispatch(loginUserWithOauth());
        }
      } catch (error) {
        console.error("Error during authentication:", error);
      }
    };

    if (!isAuthenticated && !isLoading) {
      checkUserStatus(); 
    }
  }, [dispatch, isAuthenticated, isLoading]); 

  // useEffect(() => {
  //   const cookieJwt = Cookies.get('x-auth-cookie'); // Get the cookie
  //   // Only dispatch loadUser if user is not authenticated and cookie is present
  //   if (!isAuthenticated && !isLoading && cookieJwt) {
  //     dispatch(loginUserWithOauth()); // Dispatch loginUserWithOauth if the user is not authenticated and cookie is present
  //   }
  //   setLoading(false); // Set loading to false after the check
  // }, [dispatch, isAuthenticated, isLoading]);

  //const token = Cookies.get("x-auth-token");
  // useEffect(() => {
  //   if (token && !isAuthenticated) {
  //     const fetchUser = async () => {
  //       try {
  //         await dispatch(loginUserWithOauth(token));
  //       } catch (error) {

  //         toast.error(error);
  //       }
  //     };
  //     fetchUser();
  //   }
  // }, [dispatch, isAuthenticated,token]);

  // useEffect(() => {
  //   const token = Cookies.get("x-auth-cookie"); // Get token from cookies

  //   if (token && !isAuthenticated) {
  //     dispatch(loginUserWithOauth(token)); // If token exists, authenticate user
  //   } else if (!isAuthenticated) {
  //     dispatch(loadUser()); // If no token, try to load user from cookie
  //   }
  // }, [dispatch, isAuthenticated]);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const cookieJwt = Cookies.get('x-auth-cookie');
  //       if (cookieJwt && !isAuthenticated) {
  //         console.log('is Authenticated',isAuthenticated)
  //         console.log('JWT found:', cookieJwt);
  //         dispatch(loginUserWithOauth(cookieJwt));  // Only dispatch if not authenticated
  //       }

  //       if (!isLoading && token && !isAuthenticated) {
  //         console.log('Loading user...');
  //         await dispatch(loadUser());  // Dispatch loadUser only if necessary
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user:", error);
  //     }
  //   };

  //   fetchUser();
  // }, [dispatch, isLoading, token, isAuthenticated]);  // Ensure correct dependencies to avoid unnecessary re-renders

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch categories
        const { data } = await axios.get(`${apiUrl}/api/categories`);
        setNavItems(data.data.categories);

        // Check for JWT cookie and log in user
      } catch (error) {
        console.error("Error fetching categories or user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <LoadingFullScreen />;
  }

  return (
    <>
      <Router>
        <Elements stripe={stripePromise}>
          <ScrollToTop />
          <Suspense fallback={<LoadingFullScreen />}>
            <Routes>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="/" element={<Layout navItems={navItems} />}>
                <Route index element={<Home />} />

                <Route
                  path="products/:category/:id"
                  element={<ProductList1 />}
                />
                <Route
                  path="products/:subcategory"
                  element={<SubCategories />}
                />
                <Route path="product/:id" element={<SingleProduct />} />

                <Route
                  path="favourites"
                  element={
                    <Protected>
                      <Favourites />
                    </Protected>
                  }
                />
                <Route path="cart" element={<Cart />} />
                <Route
                  path="placeorder"
                  element={
                    <Protected>
                      <PlaceOrder />
                    </Protected>
                  }
                />
                <Route
                  path="orders"
                  element={
                    <Protected>
                      <OrdersPage />
                    </Protected>
                  }
                />
                <Route
                  path="ordersuccess"
                  element={
                    <Protected>
                      <OrderSucess />
                    </Protected>
                  }
                />
                <Route path="about" element={<About />} />
                <Route path="returnpolicy" element={<ReturnPolicy />} />
                <Route path="contact" element={<Contact />} />
                <Route
                  path="account"
                  element={
                    <Protected>
                      <AccountPage />
                    </Protected>
                  }
                />
                <Route
                  path="updateProfile"
                  element={
                    <Protected>
                      <UpdateProfile />
                    </Protected>
                  }
                />
              </Route>
            </Routes>
          </Suspense>
        </Elements>
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
