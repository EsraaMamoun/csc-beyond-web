import React, { useState, useEffect } from "react";
import axiosClient from "../axios-client";
import Modal from "react-modal";
import { useStateContext } from "../context/ContextProvider";

interface SetUserSubjectMarkProps {
  isOpen: boolean;
  setSetMark: (open: boolean) => void;
}

interface User {
  id: number;
  username: string;
}

interface Subject {
  subject: {
    id: number;
    subject_name: string;
  };
}

interface SetUserSubjectMarkState {
  selectedSubject: number | null;
  selectedUser: number | null;
  users: User[];
  subjects: Subject[];
  mark: number | null;
  errors: string | null;
  submitDisabled: boolean;
}

Modal.setAppElement("#root");

export default function SetUserSubjectMark(props: SetUserSubjectMarkProps) {
  const initialState: SetUserSubjectMarkState = {
    selectedSubject: null,
    selectedUser: null,
    mark: null,
    users: [],
    subjects: [],
    errors: null,
    submitDisabled: true,
  };
  const { setNotification } = useStateContext();

  const [state, setState] = useState<SetUserSubjectMarkState>(initialState);
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    setIsModalOpen(props.isOpen);
    axiosClient.get("/account").then((response) => {
      setState((prevState) => ({ ...prevState, users: response.data }));
    });
  }, [props.isOpen]);

  const closeModal = () => {
    setIsModalOpen(false);
    props.setSetMark(false);
  };

  const fetchSubjectsForUser = (userId: number) => {
    axiosClient.get(`/user-subject/marks/${userId}`).then((response) => {
      console.log("response.data?.subject", response.data);

      if (response.data.length > 0) {
        setState((prevState) => ({
          ...prevState,
          submitDisabled: false,
          subjects: response.data,
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
          errors: `The user doesn't have subjects assigned`,
        }));
      }
    });
  };

  const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    axiosClient
      .post("/user-subject/set-mark", {
        account_id: state.selectedUser,
        subject_id: state.selectedSubject,
        mark: state.mark,
      })
      .then(() => {
        setNotification("User mark's sets successfully.");
        closeModal();
      })
      .catch(() => {
        setState((prevState) => ({
          ...prevState,
          errors: `Something went wrong`,
        }));
        closeModal();
      });
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Set User Subject Mark Modal"
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
            <h1 className="title">Set User Subject Mark</h1>

            <label>Select User:</label>
            <select
              value={state.selectedUser || ""}
              onChange={(ev) => {
                const selectedUserId = +ev.target.value;
                console.log("selectedUserId", selectedUserId);

                setState((prevState) => ({
                  ...prevState,
                  selectedUser: selectedUserId,
                }));

                fetchSubjectsForUser(selectedUserId);
              }}
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

            {state.subjects.length > 0 && (
              <>
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
                    <option key={subject.subject.id} value={subject.subject.id}>
                      {subject.subject.subject_name}
                    </option>
                  ))}
                </select>
              </>
            )}

            {!!state?.selectedSubject && (
              <>
                <label>Enter Subject Mark:</label>
                <input
                  type="number"
                  value={state.mark || ""}
                  onChange={(ev) =>
                    setState((prevState) => ({
                      ...prevState,
                      mark: +ev.target.value,
                    }))
                  }
                />
              </>
            )}

            <button disabled={state.submitDisabled} className="btn btn-block">
              Set Mark
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );
}
