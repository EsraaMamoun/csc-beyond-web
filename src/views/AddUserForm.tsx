import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/ContextProvider";
import Modal from "react-modal";

interface User {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

Modal.setAppElement("#root");

export default function AddUserForm(props: {
  onUserCreated: () => void;
  isOpen: boolean;
  setCreateForm: (open: boolean) => void;
}) {
  const [user, setUser] = useState<User>({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState<string | null>(null);
  const { setNotification } = useStateContext();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const closeModal = () => {
    setIsModalOpen(false);
    props.setCreateForm(false);
  };

  useEffect(() => {
    setIsModalOpen(props.isOpen);
  }, [props.isOpen]);

  const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    axiosClient
      .post("/account", {
        username: user.username,
        email: user.email,
        password: user.password,
        password_confirmation: user.password_confirmation,
      })
      .then(() => {
        setNotification("User was successfully created");
        closeModal();
        props.onUserCreated();
      })
      .catch((err) => {
        const response = err.response;
        if (response) {
          setErrors(err.response.data.message);
        }
      });
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="New User Modal"
      style={{
        content: {
          width: "50%",
          height: "auto",
          margin: "auto",
          overflow: "hidden",
        },
      }}
    >
      <div className="login-signup-form animated fadeInDown">
        {errors && <div className="alert">{errors}</div>}
        <div className="form">
          <form onSubmit={onSubmit}>
            <h1 className="title">Add New User</h1>
            <input
              value={user.username}
              onChange={(ev) => setUser({ ...user, username: ev.target.value })}
              placeholder="Username"
            />
            <input
              value={user.email}
              onChange={(ev) => setUser({ ...user, email: ev.target.value })}
              placeholder="Email"
            />
            <input
              type="password"
              onChange={(ev) => setUser({ ...user, password: ev.target.value })}
              placeholder="Password"
            />
            <input
              type="password"
              onChange={(ev) =>
                setUser({
                  ...user,
                  password_confirmation: ev.target.value,
                })
              }
              placeholder="Password Confirmation"
            />
            <button className="btn btn-block">Save</button>
          </form>
        </div>
      </div>
    </Modal>
  );
}
