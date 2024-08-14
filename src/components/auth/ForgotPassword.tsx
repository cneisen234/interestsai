import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { requestPasswordReset } from "../../utils/api";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await requestPasswordReset(email);
      setMessage(response.data.message);
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="center-container">
      <div className="content-wrapper">
        <div className="auth-form">
          <h2>Forgot Password</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%" }}>
              Reset Password
            </button>
          </form>
          {message && <p className="mt-3 text-center">{message}</p>}
          <p style={{ marginTop: "20px", textAlign: "center" }}>
            <Link to="/login" className="auth-link">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;