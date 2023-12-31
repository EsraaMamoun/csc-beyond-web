import { createBrowserRouter, Navigate } from "react-router-dom";
import Subjects from "./views/Subjects";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Login from "./views/Login";
import NotFound from "./views/NotFound";
import Signup from "./views/Signup";
import Users from "./views/Users";
import HomePage from "./views/HomePage";
import { useStateContext } from "./context/ContextProvider";
import { useEffect } from "react";

const AdminRoute = ({ element }: any) => {
  const { user } = useStateContext();

  useEffect(() => {}, [user]);
  const isAdmin = user?.account_type === "admin";
  return isAdmin ? element : <Navigate to="/home-page" />;
};

const UserRoute = ({ element }: any) => {
  const { user } = useStateContext();

  useEffect(() => {}, [user]);
  const isAdmin = user?.account_type === "user";
  return isAdmin ? element : <Navigate to="/" />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/users" />,
      },
      {
        path: "/subjects",
        element: <AdminRoute element={<Subjects />} />,
      },
      {
        path: "/users",
        element: <AdminRoute element={<Users />} />,
      },
      {
        path: "/home-page",
        element: <UserRoute element={<HomePage />} />,
      },
    ],
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
