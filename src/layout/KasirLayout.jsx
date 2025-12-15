import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaHome, FaBox, FaShoppingCart, FaHistory } from "react-icons/fa";

export default function KasirLayout() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;

  const kasirMenuItems = [
    { path: "/kasir/dashboard", label: "Dashboard", icon: FaHome },
    { path: "/kasir/pos", label: "Mesin Kasir", icon: FaShoppingCart },
    { path: "/kasir/transactions", label: "Riwayat", icon: FaHistory },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex relative font-sans">
      <Sidebar 
        menuItems={kasirMenuItems} 
        title="KasirPro" 
        subtitle="KASIR PANEL" 
      />
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Navbar 
          title="Kasir Area" 
          subtitle={`Halo, ${user?.username || 'Kasir'}`} 
        />
        <main className="flex-1 mt-20 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
