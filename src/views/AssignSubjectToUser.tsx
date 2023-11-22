import React, { useState, useEffect } from "react";
import axiosClient from "../axios-client";
import Modal from "react-modal";
import { useStateContext } from "../context/ContextProvider";

interface AssignSubjectToUserProps {
  isOpen: boolean;
  setAssignSubjectToUser: (open: boolean) => void;
}

interface User {
  id: number;
  username: string;
}

interface Subject {
  id: number;
  subject_name: string;
}

interface AssignSubjectToUserState {
  selectedSubject: number | null;
  selectedUser: number | null;
  users: User[];
  subjects: Subject[];
  errors: string | null;
}

Modal.setAppElement("#root");

export default function AssignSubjectToUser(props: AssignSubjectToUserProps) {
  const initialState: AssignSubjectToUserState = {
    selectedSubject: null,
    selectedUser: null,
    users: [],
    subjects: [],
    errors: null,
  };

  const [state, setState] = useState<AssignSubjectToUserState>(initialState);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const { setNotification } = useStateContext();

  useEffect(() => {
    setIsModalOpen(props.isOpen);
    axiosClient.get("/account").then((response) => {
      setState((prevState) => ({ ...prevState, users: response.data }));
    });
    axiosClient.get("/subject").then((response) => {
      setState((prevState) => ({ ...prevState, subjects: response.data }));
    });
  }, [props.isOpen]);

  const closeModal = () => {
    setIsModalOpen(false);
    props.setAssignSubjectToUser(false);
  };

  const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    axiosClient
      .post("/user-subject", {
        account_id: state.selectedUser,
        subject_id: state.selectedSubject,
      })
      .then(() => {
        setNotification("Subject assigned to the user successfully.");

        closeModal();
      })
      .catch((err) => {
        const response = err.response;
        if (response) {
          setState((prevState) => ({
            ...prevState,
            errors: response.data.message,
          }));
        }
      });
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Assign Subject to User Modal"
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
        {state.errors && <div className="alert">{state.errors}</div>}
        <div className="form">
          <form onSubmit={onSubmit}>
            <h1 className="title">Assign Subject to User</h1>

            <label>Select Subject:</label>
            <select
              value={state.selectedSubject || ""}
              onChange={(ev) =>
                setState((prevState) => ({
                  ...prevState,
                  selectedSubject: +ev.target.value,
                }))
              }
            >
              <option value="" disabled>
                Select a Subject
              </option>
              {state.subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.subject_name}
                </option>
              ))}
            </select>

            <label>Select User:</label>
            <select
              value={state.selectedUser || ""}
              onChange={(ev) =>
                setState((prevState) => ({
                  ...prevState,
                  selectedUser: +ev.target.value,
                }))
              }
            >
              <option value="" disabled>
                Select a User
              </option>
              {state.users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>

            <button className="btn btn-block">Assign Subject</button>
          </form>
        </div>
      </div>
    </Modal>
  );
}
