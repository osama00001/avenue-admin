import React, { useContext, useState } from "react";
import Footer from "../footer/Footer";
import Link from "next/link";
import { useRouter } from "next/router";
import { DigiContext } from "../../context/DigiContext";

const LoginContent = () => {
  const { passwordVisible, togglePasswordVisibility } = useContext(DigiContext);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials");
        return;
      }

      router.push("/");
    } catch {
      setError("Unable to connect. Is Avenue running on port 3000?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="main-content login-panel">
      <div className="login-body">
        <div className="top d-flex justify-content-between align-items-center">
          <div className="logo">
            <img src="/assets/images/logo-big.png" alt="Logo" />
          </div>
          <Link href="/">
            <i className="fa-duotone fa-house-chimney"></i>
          </Link>
        </div>
        <div className="bottom">
          <h3 className="panel-title">Login</h3>
          {error && (
            <div className="alert alert-danger py-2 mb-3" role="alert">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="input-group mb-30">
              <span className="input-group-text">
                <i className="fa-regular fa-user"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Username or email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group mb-20">
              <span className="input-group-text">
                <i className="fa-regular fa-lock"></i>
              </span>
              <input
                type={passwordVisible ? "text" : "password"}
                className="form-control rounded-end"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <a
                role="button"
                className="password-show"
                onClick={togglePasswordVisibility}
              >
                <i className="fa-duotone fa-eye"></i>
              </a>
            </div>
            <div className="d-flex justify-content-between mb-30">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  value=""
                  id="loginCheckbox"
                />
                <label
                  className="form-check-label text-white"
                  htmlFor="loginCheckbox"
                >
                  Remember Me
                </label>
              </div>
              <Link href="/resetPassword" className="text-white fs-14">
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100 login-btn"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <div className="other-option">
            <p>Or continue with</p>
            <div className="social-box d-flex justify-content-center gap-20">
              <Link href="#">
                <i className="fa-brands fa-facebook-f"></i>
              </Link>
              <Link href="#">
                <i className="fa-brands fa-twitter"></i>
              </Link>
              <Link href="#">
                <i className="fa-brands fa-google"></i>
              </Link>
              <Link href="#">
                <i className="fa-brands fa-instagram"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginContent;
