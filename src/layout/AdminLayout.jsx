import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { FaHome, FaUsers, FaUserShield, FaLock } from "react-icons/fa";

export default function AdminLayout() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;

  const adminMenuItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: FaHome },
    { path: "/admin/users", label: "User Management", icon: FaUsers },
    { path: "/admin/roles", label: "Role Management", icon: FaUserShield },
    { path: "/admin/system-lock", label: "System Lock", icon: FaLock },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex relative font-sans">
      <Sidebar 
        menuItems={adminMenuItems}
        title="AdminPro"
        subtitle="ADMINISTRATOR"
      />
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Navbar 
             title="Admin Dashboard" 
             subtitle={`Welcome, ${user?.username || 'Admin'}`}
        />
        <main className="flex-1 mt-20 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
