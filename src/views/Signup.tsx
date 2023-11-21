import { createRef, useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/ContextProvider";

// interface SignupErrors {
//   [key: string]: string[];
// }

export default function Signup() {
  const usernameRef = createRef<HTMLInputElement>();
  const emailRef = createRef<HTMLInputElement>();
  const passwordRef = createRef<HTMLInputElement>();
  const passwordConfirmationRef = createRef<HTMLInputElement>();
  // const { setUser, setToken } = useStateContext();
  const [errors, setErrors] = useState<string | null>(null);
  const { setNotification } = useStateContext();

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();

    const payload = {
      username: usernameRef.current?.value,
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
      password_confirmation: passwordConfirmationRef.current?.value,
    };

    axiosClient
      .post("/account", payload)
      .then(({ data }) => {
        console.log(data);

        setNotification(
          "Congratulations! Please wait for the administrator to activate your account."
        );
      })
      .catch((err) => {
        console.log(err.response.data.message);

        const response = err.response;
        if (response) {
          setErrors(err.response.data.message);
        }
      });
  };

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <h1 className="title">Signup</h1>
          {errors && <div className="alert">{errors}</div>}
          <input ref={usernameRef} type="text" placeholder="Username" />
          <input ref={emailRef} type="email" placeholder="Email Address" />
          <input ref={passwordRef} type="password" placeholder="Password" />
          <input
            ref={passwordConfirmationRef}
            type="password"
            placeholder="Repeat Password"
          />
          <button className="btn btn-block">Signup</button>
          <p className="message">
            Already registered? <Link to="/login">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
