import React, { useState, lazy, Suspense, useMemo, useEffect } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { createTheme } from "@mui/material/styles";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "./materialUiTheme";
import { useSelector } from "react-redux";
import Protected from "./components/Protected";
import { Toaster } from "react-hot-toast";
import CustomModal1 from "components/CustomModal1";
import Loading from './scenes/Loading'; // Import your loading component
import OrderDetail from "scenes/OrderDetail";
import ProductDetail from "scenes/ProductDetail";

// Lazy loading components
const Layout = lazy(() => import("./scenes/Layout"));
const Dashboard = lazy(() => import("./scenes/Dashboard"));
const Orders = lazy(() => import("./scenes/Orders"));
const Products = lazy(() => import("./scenes/Products"));
const Transactions = lazy(() => import("./scenes/Transactions"));
const Admin = lazy(() => import("./scenes/Admin"));
const Customers = lazy(() => import("./scenes/Customers"));
const Login = lazy(() => import("./scenes/login/Login"));
const ProductsCards = lazy(() => import("scenes/ProductsCards"));
const SingleProduct = lazy(() => import("scenes/SingleProduct"));

function App() {
  const [mode, setMode] = useState("light");
  const darkMode = useSelector((state) => state.theme.darkMode);
  const [isLoading, setIsLoading] = useState(true);

  useMemo(() => {
    if (darkMode) {
      setMode("dark");
    } else {
      setMode("light");
    }
  }, [darkMode]);

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  useEffect(() => {
    // Set loading to false after initial render
    const timer = setTimeout(() => setIsLoading(false), 100); // Simulate loading time
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="app">
      <CustomModal1>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <StyledThemeProvider theme={theme}>
              <CssBaseline />
              <Suspense fallback={isLoading ? <Loading /> : <null />}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route element={<Layout />}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
                    <Route path="/products/grid" element={<Protected><ProductsCards /></Protected>} />
                    <Route path="/products/table" element={<Protected><Products /></Protected>} />
                    <Route path="/products/:id" element={<Protected><ProductDetail/></Protected>} />
                    <Route path="/customers/table" element={<Protected><Customers /></Protected>} />
                    <Route path="/transactions" element={<Protected><Transactions /></Protected>} />
                    <Route path="/admin" element={<Protected><Admin /></Protected>} />
                    <Route path="/orders" element={<Protected><Orders /></Protected>} />
                    <Route path="/orders/:id" element={<Protected><OrderDetail /></Protected>} />
                  </Route>
                </Routes>
              </Suspense>
            </StyledThemeProvider>
          </ThemeProvider>
        </BrowserRouter>
      </CustomModal1>

      <Toaster
        position="top-center"
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
    </div>
  );
}

export default App;
