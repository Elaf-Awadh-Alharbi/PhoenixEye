import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const API_BASE = "http://localhost:5000";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Login failed");
        return;
      }

      const data = await res.json();

      
      login(data.user);

      
      if (data.user?.role === "citizen") {
        navigate("/submit-report");
      } else if (data.user?.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/dashboard");
      }
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
      <div className="card card-glow" style={{ maxWidth: 400, width: "100%" }}>
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
            <h1 style={{ fontSize: "1.15rem", margin: 0 }}>Sign in</h1>
          </div>
        </div>

        {error && <div className="error-text">{error}</div>}

        <form onSubmit={handleSubmit}>
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

          <label className="label">Password</label>
          <input
            type="password"
            name="password"
            className="input"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "0.5rem" }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
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
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            style={{ color: "var(--text-accent)", fontWeight: 500 }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

