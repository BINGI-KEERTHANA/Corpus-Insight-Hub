import {
  Eye,
  EyeOff,
  LogIn,
  Phone,
  Lock,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../services/api";
import { addActivity } from "../../utils/activity";

export default function Login() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    try {
      setErrorMessage("");
      setLoading(true);

      const response = await api.post("/api/v1/auth/login", {
        phone,
        password,
      });
 console.log("LOGIN RESPONSE:",response.data);

      localStorage.setItem(
        "access_token",
        response.data.access_token
      );
      
      const devicesResponse = await api.get("/api/v1/devices/");
      console.log("DEVICES RESPONSE:", devicesResponse.data);
      localStorage.setItem(
	"user_id",
	response.data.user_id
      );
      addActivity("✅ Logged in successfully");
      navigate("/dashboard");
      
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.detail ||
            error.response?.data?.message ||
            "Login failed"
        );
      } else {
        setErrorMessage("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-700 flex items-center justify-center px-4">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_35%)]" />

      <div className="relative w-full max-w-lg">

        <div className="rounded-3xl bg-white/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] border border-white/30 overflow-hidden">

          <div className="px-10 py-10 pt-10 pb-6 text-center">

            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg">

              <LogIn
                size={36}
                className="text-white"
              />

            </div>

            <h1 className="text-3xl font-bold text-gray-900">
              Corpus Insight Hub
            </h1>

            <p className="mt-3 text-gray-500">
              Search • Manage • Analyze Corpus Data
            </p>

          </div>

          <div className="px-10 pb-8">

            <form
              className="space-y-5"
              onSubmit={(e) => e.preventDefault()}
            >

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Phone Number
                </label>

                <div className="relative">

                  <Phone
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    placeholder="+91XXXXXXXXXX"
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-4 text-gray-800 placeholder:text-gray-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />

                </div>

              </div>

              <div>

                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Password
                </label>

                <div className="relative">

                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3.5 pl-12 pr-12 text-gray-800 placeholder:text-gray-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                                    <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-blue-600"
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>

                </div>

              </div>

              <button
                type="button"
                onClick={handleLogin}
                disabled={loading}
                className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 py-3.5 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:from-blue-700 hover:to-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-20"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />

                      <path
                        className="opacity-90"
                        fill="currentColor"
                        d="M12 2a10 10 0 018.5 4.7l-3.1 1.7A6.5 6.5 0 0012 5.5V2z"
                      />
                    </svg>

                    Signing In...
                  </div>
                ) : (
                  <>
                    <LogIn
                      size={20}
                      className="mr-2"
                    />
                    Login
                  </>
                )}
              </button>

              {errorMessage && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
                  {errorMessage}
                </div>
              )}

            </form>

            <div className="mt-8 border-t border-gray-200 pt-6 text-center">

              <p className="text-sm font-medium text-gray-500">
                Secure access to Corpus Insight Hub
              </p>

              <p className="mt-2 text-xs text-gray-400">
                © 2026 Corpus Insight Hub. All rights reserved.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
