import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

/***
 * Form for admin to login with password
 */
function LoginPage() {
  const { login } = useAuth();
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(input);
    if (success) {
      navigate("/admin");
    } else {
      alert("Invalid password");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <input
        type="password"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter password"
        className="text-blue-600 border p-2 mr-2"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Login
      </button>
    </form>
  );
}

export default LoginPage;
