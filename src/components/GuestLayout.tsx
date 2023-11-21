import { Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";

export default function GuestLayout() {
  const { token } = useStateContext();
  const { notification } = useStateContext();

  if (token) {
    return <Navigate to="/" />;
  }

  return (
    <div id="guestLayout">
      {notification && <div className="notification">{notification}</div>}
      <Outlet />
    </div>
  );
}
