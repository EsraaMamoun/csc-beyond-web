import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/ContextProvider";

interface Subject {
  id: number;
  subject_name: string;
  minimum_mark: number;
}

export default function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  useEffect(() => {
    getSubjects();
  }, []);

  const onDeleteClick = (subject: Subject) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) {
      return;
    }
    axiosClient.delete(`/subject/${subject.id}`).then(() => {
      setNotification("Subject was successfully deleted");
      getSubjects();
    });
  };

  const getSubjects = () => {
    setLoading(true);
    axiosClient
      .get("/subject")
      .then(({ data }) => {
        setLoading(false);
        setSubjects(data as Subject[]);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <h1>Subjects</h1>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject Name</th>
              <th>Minimum Mark</th>
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
              {subjects.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.subject_name}</td>
                  <td>{s.minimum_mark}</td>
                  <td>
                    &nbsp;
                    <button
                      className="btn-delete"
                      onClick={() => onDeleteClick(s)}
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
    </div>
  );
}
