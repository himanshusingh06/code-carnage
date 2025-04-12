import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import RegisterAccount from "./components/auth/register/account/RegisterAccount";
import Verify from "./components/auth/verify/Verify";
import Login from "./components/auth/login/Login";
import Home from "./components/Home/Home";
import RegisterClinic from "./components/auth/register/company/RegisterClinic";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
    ],
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
      {
        path: "register/clinic/",
        element: <RegisterClinic />,
      },
      // {
      //   path: "register/candidate/",
      //   element: <RegisterCandidate />,
      // },
      {
        path: "login/",
        element: <Login />,
      },
    ],
  }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
