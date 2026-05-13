import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await api.post("/auth/login", form);

    login(res.data.user, res.data.token);

    navigate("/reports");
  };

  return (
    <div className="min-h-screen bg-[#0d0f14] flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#11141c] p-8 rounded-xl w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-[#4ade80]">
          Admin Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 bg-[#1a1f2b] rounded-lg"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 bg-[#1a1f2b] rounded-lg"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="w-full bg-[#4ade80] text-black py-3 rounded-lg font-semibold">
          Login
        </button>
      </form>
    </div>
  );
}