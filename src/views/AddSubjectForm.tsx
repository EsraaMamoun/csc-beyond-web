import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/ContextProvider";
import Modal from "react-modal";

interface Subject {
  subject_name: string;
  minimum_mark: string;
}

Modal.setAppElement("#root");

export default function AddSubjectForm() {
  const [subject, setSubject] = useState<Subject>({
    subject_name: "",
    minimum_mark: "",
  });
  const [errors, setErrors] = useState<string | null>(null);
  const { setNotification } = useStateContext();
  const [isModalOpen, setIsModalOpen] = useState(true);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    openModal();
  }, []);

  const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    axiosClient
      .post("/subject", {
        subject_name: subject.subject_name,
        minimum_mark: +subject.minimum_mark,
      })
      .then(() => {
        setNotification("Subject was successfully created");
        closeModal();
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
    >
      <div className="login-signup-form animated fadeInDown">
        {errors && <div className="alert">{errors}</div>}
        <form onSubmit={onSubmit}>
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
          <button className="btn">Save</button>
        </form>
      </div>
    </Modal>
  );
}
