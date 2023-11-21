import React, { createRef, useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/ContextProvider";

interface SignupErrors {
  [key: string]: string[];
}

export default function Signup() {
  const usernameRef = createRef<HTMLInputElement>();
  const emailRef = createRef<HTMLInputElement>();
  const passwordRef = createRef<HTMLInputElement>();
  const passwordConfirmationRef = createRef<HTMLInputElement>();
  const { setUser, setToken } = useStateContext();
  const [errors, setErrors] = useState<SignupErrors | null>(null);

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();

    const payload = {
      username: usernameRef.current?.value,
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
      // password_confirmation: passwordConfirmationRef.current?.value,
    };

    axiosClient
      .post("/account", payload)
      .then(({ data }) => {
        console.log(data);

        setUser(data);
        setToken(data.tokens.access_token);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 400) {
          setErrors(response.data.errors);
        }
      });
  };

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <h1 className="title">Signup for Free</h1>
          {errors && (
            <div className="alert">
              {Object.keys(errors).map((key) => (
                <p key={key}>{errors[key][0]}</p>
              ))}
            </div>
          )}
          <input ref={usernameRef} type="text" placeholder="Full Name" />
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
