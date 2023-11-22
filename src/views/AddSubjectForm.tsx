import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/ContextProvider";
import Modal from "react-modal";

interface Subject {
  subject_name: string;
  minimum_mark: string;
}

Modal.setAppElement("#root");

export default function AddSubjectForm(props: {
  isOpen: boolean;
  setCreateSubjectForm: (open: boolean) => void;
}) {
  const [subject, setSubject] = useState<Subject>({
    subject_name: "",
    minimum_mark: "",
  });
  const [errors, setErrors] = useState<string | null>(null);
  const { setNotification } = useStateContext();
  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    setIsModalOpen(props.isOpen);
  }, [props.isOpen]);

  const closeModal = () => {
    setIsModalOpen(false);
    props.setCreateSubjectForm(false);
  };

  const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    axiosClient
      .post("/subject", {
        subject_name: subject.subject_name,
        minimum_mark: +subject.minimum_mark,
      })
      .then(() => {
        setNotification("Subject was successfully created");
        closeModal(); // Close modal on successful submission
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
      contentLabel="New Subject Modal"
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
            <h1 className="title">Add New Subject</h1>

            <input
              value={subject.subject_name}
              onChange={(ev) =>
                setSubject({ ...subject, subject_name: ev.target.value })
              }
              placeholder="Subject name"
            />
            <input
              value={subject.minimum_mark}
              onChange={(ev) =>
                setSubject({ ...subject, minimum_mark: ev.target.value })
              }
              type="number"
              placeholder="Minimum mark"
            />
            <button className="btn btn-block">Save</button>
          </form>
        </div>
      </div>
    </Modal>
  );
}
