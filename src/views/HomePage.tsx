import { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/ContextProvider";

interface SubjectsMark {
  id: number;
  subject_id: number;
  mark: string;
  subject: {
    minimum_mark: number;
    subject_name: string;
  };
}

export default function HomePage() {
  const { user } = useStateContext();
  const [subjectsData, setSubjectsData] = useState<SubjectsMark[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserSubjects();
  }, []);

  const getUserSubjects = () => {
    axiosClient
      .post("/user-subject/marks")
      .then(({ data }) => {
        setSubjectsData(data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div className="student">
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{user.username}</td>
              <td>{user.email}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>Subject</th>
              <th>Pass Mark</th>
              <th>Mark Obtained</th>
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
              {subjectsData.map((s) => (
                <tr key={s.id}>
                  <td>{s.subject.subject_name}</td>
                  <td>{s.subject.minimum_mark}</td>
                  <td
                    className={
                      Number(s.mark) < Number(s.subject.minimum_mark)
                        ? "text-red"
                        : "text-green"
                    }
                  >
                    {s.mark}
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
