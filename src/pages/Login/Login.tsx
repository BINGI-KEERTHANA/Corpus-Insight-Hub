import { Eye, EyeOff, LogIn } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../services/api";

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

      // Save token
      localStorage.setItem(
        "access_token",
        response.data.access_token
      );

      // Save user id
      const userId =
        response.data.user_id ||
        response.data.user?.id;

      if (userId) {
        localStorage.setItem("user_id", userId);
      }

      // Get device details
      try {
        const deviceResponse = await api.get(
          "/api/v1/devices/"
        );

        if (
          Array.isArray(deviceResponse.data) &&
          deviceResponse.data.length > 0
        ) {
          // IMPORTANT: use device_id not uid
          const deviceId =
            deviceResponse.data[0].device_id;

          if (deviceId) {
            localStorage.setItem(
              "device_id",
              deviceId
            );
          }
        }
      } catch (error) {
        console.error("Device API Error:", error);
      }

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
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-blue-600 text-white px-8 py-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-4 rounded-full">
              <LogIn size={36} />
            </div>
          </div>

          <h1 className="text-3xl font-bold">
            LexiHub
          </h1>

          <p className="text-blue-100 mt-2">
            Secure access to your Corpus workspace
          </p>
        </div>

        <div className="p-8">
          <form
            className="space-y-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>

              <input
                type="text"
                placeholder="+91XXXXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-12"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2"
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
              className="w-full rounded-xl bg-blue-600 py-3 text-white"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

            {errorMessage && (
              <div className="rounded-lg bg-red-50 p-3 text-red-600">
                {errorMessage}
              </div>
            )}
          </form>

          <div className="mt-8 border-t pt-4 text-center text-sm text-gray-500">
            © 2026 LexiHub
          </div>
        </div>
      </div>
    </div>
  );
}