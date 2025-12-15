import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaHome, FaUsers, FaUserShield, FaLock, FaSignOutAlt, FaCoffee, FaClipboardList, FaBoxOpen } from "react-icons/fa";

export default function Sidebar({ menuItems, title = "KasirPro", subtitle = "PANEL" }) {
  const { logout } = useAuth();
  const location = useLocation();

  // Fallback items if for some reason menuItems is not provided (should not happen with updated layouts)
  const items = menuItems || [];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-[#1e293b] h-screen fixed left-0 top-0 shadow-2xl flex-col z-40 hidden md:flex text-gray-100 font-sans border-r border-gray-800">
      {/* Brand Logo */}
      <div className="h-20 flex items-center px-8 border-b border-gray-800 bg-[#0f172a]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-amber-500/30">
            <FaCoffee size={16} />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white tracking-tight">{title}</h1>
            <p className="text-[10px] text-gray-400 font-bold tracking-widest uppercase">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-wider mb-4"></p>
        
        {items.map((item) => (
          <Link to={item.path} key={item.path} className="block">
            <div className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive(item.path) 
                ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25" 
                : "text-gray-400 hover:bg-gray-800 hover:text-white"
            }`}>
              <item.icon className={`text-lg ${isActive(item.path) ? "text-white" : "text-gray-500 group-hover:text-amber-400"}`} />
              <span className="font-medium text-sm">{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-gray-800 bg-[#0f172a]">
        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all font-medium text-sm group"
        >
          <FaSignOutAlt className="group-hover:translate-x-1 transition-transform" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
}
