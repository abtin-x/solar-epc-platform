import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin({ language = "en" }) {
  const navigate = useNavigate();
  const isFa = language === "fa";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const text = {
    title: isFa ? "ورود ادمین" : "Admin Login",
    subtitle: isFa
      ? "برای ورود به داشبورد، اطلاعات ادمین را وارد کنید."
      : "Enter your admin credentials to access the dashboard.",
    email: isFa ? "ایمیل" : "Email",
    password: isFa ? "رمز عبور" : "Password",
    submit: isFa ? "ورود" : "Login",
    loading: isFa ? "در حال ورود..." : "Signing in...",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Login failed");
      }

      navigate("/admin-dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#f8f6f1] px-6 py-10 ${isFa ? "text-right" : "text-left"}`}>
      <div className="mx-auto max-w-md">
        <div className="rounded-[28px] border border-[#e7dcc7] bg-white p-8 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          <h1 className="text-3xl font-bold text-slate-900">{text.title}</h1>
          <p className="mt-3 text-slate-600">{text.subtitle}</p>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">{text.email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-[#d8cfbf] bg-white px-4 py-3 text-slate-900 outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">{text.password}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-[#d8cfbf] bg-white px-4 py-3 text-slate-900 outline-none focus:border-amber-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full rounded-2xl px-6 py-3 font-semibold"
            >
              {loading ? text.loading : text.submit}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
