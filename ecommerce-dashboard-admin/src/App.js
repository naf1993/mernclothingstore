import React, { useState } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "./materialUiTheme";
import Layout from "./scenes/Layout";
import Dashboard from "./scenes/Dashboard";
import Orders from "./scenes/Orders";
import Products from "./scenes/Products";
import Transactions from "./scenes/Transactions";
import Admin from "./scenes/Admin";
import Customers from "./scenes/Customers";
import Login from "./scenes/login/Login";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Protected from "./components/Protected";
import NotFound from "scenes/NotFound";
import ProductCreate from "scenes/ProductCreate";
import ProductsCards from "scenes/ProductsCards";
import SingleProduct from "scenes/SingleProduct";
import { Toaster } from "react-hot-toast";

function App() {
  const [mode, setMode] = useState("light");
  const darkMode = useSelector((state) => state.theme.darkMode);

  useMemo(() => {
    if (darkMode) {
      setMode("light");
    } else {
      setMode("dark");
    }
  }, [darkMode]);

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <StyledThemeProvider theme={theme}>

        
          <CssBaseline />
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/dashboard"
                element={
                  <Protected>
                    <Dashboard />
                  </Protected>
                }
              />
              <Route
                path="/products/grid"
                element={
                  <Protected>
                    <ProductsCards/>
                  </Protected>
                }
              />
                <Route
                path="/products/table"
                element={
                  <Protected>
                    <Products/>
                  </Protected>
                }
              />
              <Route
                path="/products/:id"
                element={
                  <Protected>
                    <SingleProduct/>
                  </Protected>
                }
              />
             

              <Route
                path="/customers/table"
                element={
                  <Protected>
                    <Customers />
                  </Protected>
                }
              />
              <Route
                path="/transactions"
                element={
                  <Protected>
                    <Transactions />
                  </Protected>
                }
              />
              <Route
                path="/admin"
                element={
                  <Protected>
                    <Admin />
                  </Protected>
                }
              />
              <Route
                path="/orders"
                element={
                  <Protected>
                    <Orders />
                  </Protected>
                }
              />
            </Route>
            
            
          </Routes>
          </StyledThemeProvider>
        </ThemeProvider>
      </BrowserRouter>
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
