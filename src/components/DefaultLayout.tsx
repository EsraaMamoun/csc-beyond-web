import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";
import axiosClient from "../axios-client";
import { useEffect } from "react";

export default function DefaultLayout() {
  const { user, token, setUser, setToken, notification } = useStateContext();

  if (!token) {
    return <Navigate to="/login" />;
  }

  const onLogout = (ev: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    ev.preventDefault();

    axiosClient.post("auth/logout").then(() => {
      setUser({});
      setToken(null);
    });
  };

  useEffect(() => {
    console.log("token", token);

    axiosClient.post("/account/current").then(({ data }) => {
      setUser({
        id: data.id,
        username: data.username,
        is_active: data.is_active,
        account_type: data.account_type,
        email: data.email,
      });
    });
  }, []);

  return user.account_type === "admin" ? (
    <div id="adminLayout">
      <aside>
        <Link to="/subjects">Subjects</Link>
        <Link to="/users">Users</Link>
      </aside>
      <div className="content">
        <header>
          <div>Header</div>
          <div>
            {user.username} &nbsp; &nbsp;
            <a onClick={onLogout} className="btn-logout" href="#">
              Logout
            </a>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
        {notification && <div className="notification">{notification}</div>}
      </div>
    </div>
  ) : (
    <div id="userLayout">
      <header>
        <div>Header</div>
        <div>
          <a onClick={onLogout} className="btn-logout" href="#">
            Logout
          </a>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
