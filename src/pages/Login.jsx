
import { useState } from "react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Login() {
  const {
    login,
    register,
  } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [isSignIn, setIsSignIn] =
    useState(false);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // =========================
  // FORM SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // =========================
    // REGISTER
    // =========================

    if (isSignIn) {

      if (!name.trim()) {
        setError("Name is required.");
        return;
      }

      if (!email.trim()) {
        setError("Email is required.");
        return;
      }

      if (!/^\S+@\S+\.\S+$/.test(email)) {
        setError(
          "Enter a valid email address."
        );
        return;
      }

      if (!password) {
        setError(
          "Password is required."
        );
        return;
      }

      if (password.length < 6) {
        setError(
          "Password must contain at least 6 characters."
        );
        return;
      }

      if (!confirmPassword) {
        setError(
          "Please confirm your password."
        );
        return;
      }

      if (
        password !== confirmPassword
      ) {
        setError(
          "Passwords do not match."
        );
        return;
      }

      try {

        const result = await register(
          name.trim(),
          email.trim(),
          password
        );

        if (!result.success) {
          setError(result.message);
          return;
        }

        setSuccess(
          "Account created successfully! Please login."
        );

        setName("");
        setPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          setIsSignIn(false);
          setSuccess("");
        }, 1200);

      } catch (error) {

        console.error(
          "Registration error:",
          error
        );

        setError(
          "Unable to create account. Please try again."
        );
      }

      return;
    }

    // =========================
    // LOGIN
    // =========================

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError(
        "Enter a valid email address."
      );
      return;
    }

    if (!password) {
      setError(
        "Password is required."
      );
      return;
    }

    try {

      const result = await login(
        email.trim(),
        password
      );

      if (!result.success) {
        setError(result.message);
        return;
      }

      const destination =
        location.state?.from || "/";

      navigate(destination, {
        replace: true,
      });

    } catch (error) {

      console.error(
        "Login error:",
        error
      );

      setError(
        "Unable to login. Please try again."
      );
    }
  };

  // =========================
  // OPEN REGISTER
  // =========================

  const openSignIn = () => {
    setIsSignIn(true);
    setError("");
    setSuccess("");
    setPassword("");
    setConfirmPassword("");
  };

  // =========================
  // OPEN LOGIN
  // =========================

  const openLogin = () => {
    setIsSignIn(false);
    setError("");
    setSuccess("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <main className="login-page">

      <div className="login-card">

        <div className="login-icon">
          ✦
        </div>

        <h1>
          {isSignIn
            ? "Create your Atlas Aura account"
            : "Welcome to Atlas Aura"}
        </h1>

        <p>
          {isSignIn
            ? "Create an account to start your travel journey."
            : "Login to continue your travel booking."}
        </p>

        <form onSubmit={handleSubmit}>

          {/* NAME */}

          {isSignIn && (
            <label>
              Name

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter your name"
              />
            </label>
          )}

          {/* EMAIL */}

          <label>
            Email

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
            />
          </label>

          {/* PASSWORD */}

          <label>
            Password

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter password"
            />
          </label>

          {/* CONFIRM PASSWORD */}

          {isSignIn && (
            <label>
              Confirm Password

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                placeholder="Confirm password"
              />
            </label>
          )}

          {/* ERROR */}

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          {/* SUCCESS */}

          {success && (
            <p className="form-success">
              {success}
            </p>
          )}

          {/* SUBMIT */}

          <button
            type="submit"
            className="login-button"
          >
            {isSignIn
              ? "Create Account →"
              : "Login →"}
          </button>

        </form>

        {/* SWITCH LOGIN / REGISTER */}

        <div className="login-switch">

          {isSignIn ? (
            <p>
              Already have an account?{" "}

              <button
                type="button"
                onClick={openLogin}
              >
                Login
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}

              <button
                type="button"
                onClick={openSignIn}
              >
                Create Account
              </button>
            </p>
          )}

        </div>

      </div>

    </main>
  );
}

export default Login;
