import React, { useState } from "react";
import { loginUser, registerUser } from "../api";
import "./login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "useradmin@gmail.com",
    password: "admin1234",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      if (isRegistering) {
        // Confirm password check
        if (form.password !== form.confirmPassword) {
          setMessage("Passwords do not match!");
          return;
        }

        // Register user
        const result = await registerUser(form.email, form.password);
        console.log("Register Success", result);
        setMessage("Registration successful! Please login.");
        setIsRegistering(false);
        setForm({ email: "", password: "", confirmPassword: "" });
      } else {
        // Login user
        const result = await loginUser(form.email, form.password);
        console.log("Login Success", result);
        localStorage.setItem("token", result.token);
        navigate("/menu");
      }
    } catch (err) {
      console.log(isRegistering ? "Register Error" : "Login Error", err);
      setMessage(err.message);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">{isRegistering ? "Register" : "Login"}</h2>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-group">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="input-field"
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="input-field"
          />
        </div>

        {isRegistering && (
          <div className="input-group">
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              className="input-field"
            />
          </div>
        )}

        <div className="button-group">
          <button type="submit" className="login-button">
            {isRegistering ? "Register" : "Login"}
          </button>
          <button
            type="button"
            className="register-button"
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? "Back to Login" : "Register"}
          </button>
        </div>
      </form>

      {message && (
        <p
          className={message.includes("success") ? "success-msg" : "error-msg"}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Login;