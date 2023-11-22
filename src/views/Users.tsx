import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/ContextProvider";
import EditUserForm from "./EditUserForm";
import AddUserForm from "./AddUserForm";
import AddSubjectForm from "./AddSubjectForm";
import AssignSubjectToUser from "./AssignSubjectToUser";
import SetUserSubjectMark from "./SetUserSubjectMark";

interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const [isEditFormVisible, setEditFormVisible] = useState(false);
  const [accountId, setAccountId] = useState<number | null>(null);
  const [isCreateFormVisible, setCreateFormVisible] = useState(false);
  const [isCreateSubjectFormVisible, setCreateSubjectFormVisible] =
    useState(false);
  const [isAssignSubjectToUserVisible, setAssignSubjectToUserVisible] =
    useState(false);
  const [isSetMarkVisible, setSetMarkVisible] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  const onDeleteClick = (user: User) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    axiosClient.delete(`/account/${user.id}`).then(() => {
      setNotification("User was successfully deleted");
      getUsers();
    });
  };

  const getUsers = () => {
    setLoading(true);
    axiosClient
      .get("/account")
      .then(({ data }) => {
        setLoading(false);
        setUsers(data as User[]);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleEditClick = (id: number) => {
    setEditFormVisible(true);
    setAccountId(id);
  };

  const handleUserUpdated = () => {
    getUsers();
    setEditFormVisible(false);
  };

  const handleCreateClick = () => {
    console.log("clickeeed");

    setCreateFormVisible(true);
  };

  const handleUserCreated = () => {
    getUsers();
    setEditFormVisible(false);
  };

  const handleCreateSubjectClick = () => {
    setCreateSubjectFormVisible(true);
  };

  const handleAssignSubjectToUserClick = () => {
    setAssignSubjectToUserVisible(true);
  };

  const handleSetMarkClick = () => {
    setSetMarkVisible(true);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>Users</h1>
        <button className="btn-add" onClick={() => handleCreateClick()}>
          Add user
        </button>
        <button className="btn-add" onClick={() => handleCreateSubjectClick()}>
          Add subject
        </button>
        <button
          className="btn-add"
          onClick={() => handleAssignSubjectToUserClick()}
        >
          Assign subject to user
        </button>
        <button className="btn-add" onClick={() => handleSetMarkClick()}>
          Set mark
        </button>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Create Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          {loading && (
            <tbody>
              <tr>
                <td colSpan={5} className="text-center">
                  Loading...
                </td>
              </tr>
            </tbody>
          )}
          {!loading && (
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.created_at}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEditClick(u.id)}
                    >
                      Edit
                    </button>
                    &nbsp;
                    <button
                      className="btn-delete"
                      onClick={() => onDeleteClick(u)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      {isEditFormVisible && (
        <EditUserForm
          id={accountId}
          onUserUpdated={handleUserUpdated}
          isOpen={isEditFormVisible}
          setEditForm={(open: boolean) => setEditFormVisible(open)}
        />
      )}
      {isCreateFormVisible && (
        <AddUserForm
          onUserCreated={handleUserCreated}
          isOpen={isCreateFormVisible}
          setCreateForm={(open: boolean) => setCreateFormVisible(open)}
        />
      )}
      {isCreateSubjectFormVisible && (
        <AddSubjectForm
          isOpen={isCreateSubjectFormVisible}
          setCreateSubjectForm={(open: boolean) =>
            setCreateSubjectFormVisible(open)
          }
        />
      )}
      {isAssignSubjectToUserVisible && (
        <AssignSubjectToUser
          isOpen={isAssignSubjectToUserVisible}
          setAssignSubjectToUser={(open: boolean) =>
            setAssignSubjectToUserVisible(open)
          }
        />
      )}
      {isSetMarkVisible && (
        <SetUserSubjectMark
          isOpen={isSetMarkVisible}
          setSetMark={(open: boolean) => setSetMarkVisible(open)}
        />
      )}
    </div>
  );
}
