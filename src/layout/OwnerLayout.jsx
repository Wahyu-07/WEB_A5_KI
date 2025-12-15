import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { FaHome, FaClipboardList, FaBoxOpen } from "react-icons/fa";

export default function OwnerLayout() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;

  // Explicitly define Owner Menu Items here for clarity
  const ownerMenuItems = [
    { path: "/owner/dashboard", label: "Dashboard", icon: FaHome },
    { path: "/owner/transactions", label: "Laporan Transaksi", icon: FaClipboardList },
    { path: "/owner/products", label: "Manajemen Menu", icon: FaBoxOpen },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex relative font-sans">
      <Sidebar 
        menuItems={ownerMenuItems} 
        title="OwnerPanel" 
        subtitle="OWNER ACCESS" 
      />
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Navbar 
          title="Owner Dashboard" 
          subtitle={`Welcome, ${user?.username || 'Owner'}`} 
        />
        <main className="flex-1 mt-20 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
