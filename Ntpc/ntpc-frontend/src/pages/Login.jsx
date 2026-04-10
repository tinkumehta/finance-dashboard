import { useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const res = await API.post("/auth/login", form);

    login(res.data);

    if (res.data.user.role === "HOD") {
      navigate("/hod");
    } else {
      navigate("/employee");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-xl mb-4">Login</h1>

      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className="border p-2 block mb-2"
      />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="border p-2 block mb-2"
      />

      <button onClick={handleSubmit} className="bg-blue-500 text-white p-2">
        Login
      </button>
    </div>
  );
}