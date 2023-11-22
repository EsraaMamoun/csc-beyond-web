import { createRef, useState, FormEvent, useEffect } from "react";
import Modal from "react-modal";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/ContextProvider";

interface User {
  id: number | null;
  username: string;
  email: string;
  is_active?: boolean;
}

Modal.setAppElement("#root");

export default function EditUserForm(props: {
  id: number | null;
  onUserUpdated: () => void;
  isOpen: boolean;
  setEditForm: (open: boolean) => void;
}) {
  const [user, setUser] = useState<User>({
    id: null,
    username: "",
    email: "",
  });
  const usernameRef = createRef<HTMLInputElement>();
  const emailRef = createRef<HTMLInputElement>();
  const [errors, setErrors] = useState<string | null>(null);
  const { setNotification } = useStateContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    props.setEditForm(false);
  };
  const id = props.id;

  useEffect(() => {
    if (id) {
      axiosClient
        .get(`/account/${id}`)
        .then(({ data }) => {
          setUser({
            id: data.id,
            username: data.username,
            email: data.email,
            is_active: data.is_active,
          });
          openModal();
        })
        .catch((err) => {
          const response = err.response;
          if (response) {
            setErrors(err.response.data.message);
          }
        });
    }
    setIsModalOpen(props.isOpen);
  }, [id, props.isOpen]);

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();

    const payload = {
      username: usernameRef.current?.value,
      email: emailRef.current?.value,
    };

    axiosClient
      .patch(`/account/${id}`, payload)
      .then(({}) => {
        setNotification("Profile updated successfully.");
        closeModal();

        props.onUserUpdated();
      })
      .catch((err) => {
        const response = err.response;
        if (response) {
          setErrors(err.response.data.message);
        }
      });
  };

  const activateUserSubmit = () => {
    const payload = {
      is_active: true,
    };

    axiosClient
      .patch(`/account/activate/${id}`, payload)
      .then(() => {
        setNotification("Profile activated successfully.");
        closeModal();

        props.onUserUpdated();
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
      contentLabel="Edit Profile Modal"
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
        <div className="form">
          <form onSubmit={onSubmit}>
            <h1 className="title">Edit Profile</h1>
            {errors && <div className="alert">{errors}</div>}
            <input
              ref={usernameRef}
              type="text"
              placeholder="Username"
              value={user.username}
              onChange={(e) =>
                setUser((prevUser) => ({
                  ...prevUser,
                  username: e.target.value,
                }))
              }
            />
            <input
              ref={emailRef}
              type="email"
              placeholder="Email Address"
              value={user.email}
              onChange={(e) =>
                setUser((prevUser) => ({
                  ...prevUser,
                  email: e.target.value,
                }))
              }
            />
            <button type="submit" className="btn btn-block">
              Update Profile
            </button>
          </form>
          {!user.is_active && (
            <button
              style={{ marginTop: 5 }}
              type="submit"
              className="btn btn-block"
              onClick={activateUserSubmit}
            >
              Activate Account
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
