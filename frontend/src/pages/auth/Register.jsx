import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const API_BASE = "http://localhost:5000";

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "citizen", 
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          role: form.role,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Registration failed");
        return;
      }

      const data = await res.json();

      login(data.user);

      navigate("/register-success");
    } catch (err) {
      console.error(err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="card card-glow" style={{ maxWidth: 420, width: "100%" }}>
        { }
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1.5rem",
          }}
        >
          <div className="avatar-circle">PE</div>
          <div>
            <div
              style={{
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: "var(--text-secondary)",
              }}
            >
              PhoenixEye
            </div>
            <h1 style={{ fontSize: "1.15rem", margin: 0 }}>
              Create your account
            </h1>
          </div>
        </div>

        {error && <div className="error-text">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="label">Full Name</label>
          <input
            type="text"
            name="fullName"
            className="input"
            placeholder="e.g. Abdulrahman Saud"
            value={form.fullName}
            onChange={handleChange}
            required
          />

          <label className="label">Email</label>
          <input
            type="email"
            name="email"
            className="input"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <div style={{ flex: 1 }}>
              <label className="label">Password</label>
              <input
                type="password"
                name="password"
                className="input"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ flex: 1 }}>
              <label className="label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="input"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <span className="label">Role</span>
            <div style={{ display: "flex", gap: "1rem", fontSize: "0.85rem" }}>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="citizen"
                  checked={form.role === "citizen"}
                  onChange={handleChange}
                  style={{ marginRight: "0.25rem" }}
                />
                Citizen
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={form.role === "admin"}
                  onChange={handleChange}
                  style={{ marginRight: "0.25rem" }}
                />
                Admin
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "0.5rem" }}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p
          style={{
            marginTop: "1rem",
            fontSize: "0.8rem",
            textAlign: "center",
            color: "var(--text-secondary)",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{ color: "var(--text-accent)", fontWeight: 500 }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
