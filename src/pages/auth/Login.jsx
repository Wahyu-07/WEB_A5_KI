import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { login as apiLogin } from "../../api/auth";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaLock, FaSignInAlt, FaCircleNotch, FaCoffee } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Mock API calling
      const response = await apiLogin(formData.username, formData.password);
      
      if (response.token) {
        // Use user object from response if available, otherwise decode token
        const userData = response.user || jwtDecode(response.token);
        login(response.token, userData);



        // Robust Role-Based Redirection
        // Check primary role for dashboard
        // In a unified dashboard system, we actually just go to /dashboard usually, 
        // but let's decide the "best" default view.
        // Or simply: navigate("/dashboard") and let the DashboardRouter handle it.
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal masuk ke sistem. Periksa username dan password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden font-sans">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full bg-amber-500/10 blur-[120px] opacity-40"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[100px] opacity-30"></div>
      </div>

      <div 
        className="relative z-10 w-full max-w-md bg-[#1e293b] rounded-2xl shadow-2xl border border-gray-700/50 p-8 md:p-10 overflow-hidden"
      >
        <div className="text-center mb-8">
          <div 
             className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-amber-500 text-white mb-4 shadow-lg shadow-amber-500/20"
          >
            <FaCoffee size={28} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Selamat Datang Kembali</h1>
          <p className="text-gray-400 mt-2 text-sm">Masuk untuk mengakses dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div 
                className="bg-red-500/10 text-red-400 text-sm p-4 rounded-lg border border-red-500/20 flex items-start gap-3"
              >
                <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                <p>{error}</p>
              </div>
            )}

          <div className="space-y-4">
            <div className="group">
              <label className="block text-xs font-bold text-gray-400 mb-1.5 ml-1 uppercase tracking-wider">Nama Pengguna</label>
              <div className="relative">
                <input 
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#0f172a]/50 border border-gray-700 rounded-xl focus:bg-[#0f172a] focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all outline-none text-white placeholder-gray-500"
                  placeholder="Masukkan username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
                <FaUser className="absolute left-3.5 top-3.5 text-gray-500 group-focus-within:text-amber-500 transition-colors text-sm" />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-gray-400 mb-1.5 ml-1 uppercase tracking-wider">Kata Sandi</label>
              <div className="relative">
                <input 
                  type="password"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-[#0f172a]/50 border border-gray-700 rounded-xl focus:bg-[#0f172a] focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all outline-none text-white placeholder-gray-500"
                  placeholder="Masukkan kata sandi"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <FaLock className="absolute left-3.5 top-3.5 text-gray-500 group-focus-within:text-amber-500 transition-colors text-sm" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <FaCircleNotch className="animate-spin" /> Sedang Masuk...
              </>
            ) : (
              <>
                Masuk <FaSignInAlt />
              </>
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center border-t border-gray-700/50 pt-6">
            <p className="text-xs text-gray-500">© 2024 Sistem POS Caffeine</p>
        </div>
      </div>
    </div>
  );
}
