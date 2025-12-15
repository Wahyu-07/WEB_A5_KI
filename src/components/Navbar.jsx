import { useAuth } from "../contexts/AuthContext";
import { FaUserCircle, FaBell, FaSearch } from "react-icons/fa";

export default function Navbar({ title, subtitle }) {
  const { user } = useAuth();
  const username = user?.username || "Pengguna";
  const role = user?.role || "Admin";
  const initial = username.charAt(0).toUpperCase();

  return (
    <header className="h-20 fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] z-30 flex items-center justify-between px-8 transition-all bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
      
      {/* Search / Breadcrumb */}
      <div className="hidden md:block">
        <h2 className="text-gray-800 font-bold text-xl tracking-tight">{title || "Dashboard Overview"}</h2>
        <p className="text-gray-500 text-xs font-medium mt-0.5">{subtitle || `Selamat datang kembali, ${username}`}</p>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-5">
        <button className="relative p-2 text-gray-400 hover:text-amber-500 transition-colors group">
          <FaBell size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-200 mx-1"></div>
        
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-700 leading-none group-hover:text-amber-600 transition-colors">{username}</p>
            <p className="text-xs text-gray-400 font-medium leading-none mt-1 capitalize">{role}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center font-bold shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all ring-2 ring-white">
            {initial}
          </div>
        </div>
      </div>
    </header>
  );
}
