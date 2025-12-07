import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function RegisterSuccessPage() {
  const { user } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleContinue = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role === "citizen") {
      navigate("/submit-report");
    } else if (user.role === "admin") {
      navigate("/dashboard");
    } else {
      navigate("/login");
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
      <div className="card card-glow" style={{ maxWidth: 460, width: "100%" }}>
        { }
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.85rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "999px",
              background: "var(--primary-gradient)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0e1220",
              fontSize: "1.3rem",
              fontWeight: 700,
            }}
          >
            ✓
          </div>
          <div>
            <div
              style={{
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "var(--text-secondary)",
              }}
            >
              Registration Complete
            </div>
            <h1 style={{ fontSize: "1.2rem", margin: 0 }}>
              Welcome to PhoenixEye
            </h1>
          </div>
        </div>

        { }
        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--text-secondary)",
            marginBottom: "1.25rem",
          }}
        >
          {user ? (
            <>
              Your account for{" "}
              <span style={{ color: "var(--text-accent)" }}>
                {user.fullName}
              </span>{" "}
              has been created successfully. You can now start using PhoenixEye
              to {user.role === "citizen"
                ? "submit roadkill reports and help keep roads safer."
                : "review reports, deploy drones, and monitor operations."}
            </>
          ) : (
            "Your account has been created successfully. You can now sign in and start using PhoenixEye."
          )}
        </p>

        { }
        {user && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.25rem 0.85rem",
              borderRadius: 999,
              background: "#181c30",
              border: "1px solid var(--border)",
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
              marginBottom: "1.25rem",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "999px",
                background:
                  user.role === "admin" ? "var(--primary)" : "#4ade80",
              }}
            />
            Signed in as{" "}
            <span style={{ color: "var(--text-accent)" }}>{user.role}</span>
          </div>
        )}

        { }
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={handleContinue}
          >
            {user?.role === "citizen"
              ? "Start submitting reports"
              : "Go to dashboard"}
          </button>

          <button
            className="btn"
            style={{ flex: 1 }}
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

