import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import RegisterAccount from "./components/auth/register/account/RegisterAccount";
import Verify from "./components/auth/verify/Verify";
import RegisterCompany from "./components/auth/register/company/RegisterCompany";
import Login from "./components/auth/login/Login";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
  },
  {
    path: "/accounts/",
    element: <Layout />,
    children: [
      {
        path: "register",
        element: <RegisterAccount />,
      },
      {
        path: "register/verify",
        element: <Verify />,
      },
      // {
      //   path: "register/company",
      //   element: <RegisterCompany />,
      // },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },


]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
