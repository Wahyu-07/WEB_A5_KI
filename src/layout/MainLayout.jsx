import { useRef } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { FaHome, FaUsers, FaUserShield, FaLock, FaClipboardList, FaBoxOpen, FaShoppingCart, FaHistory, FaTags } from "react-icons/fa";

export default function MainLayout() {
  const { user, loading, hasRole } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;

  // Define ALL possible menu items
  const allMenuItems = [
      // Common / Dashboard
      { 
          path: "/dashboard", 
          label: "Dashboard", 
          icon: FaHome, 
          roles: ["admin", "owner", "kasir"] 
      },
      
      // Admin Only
      { 
          path: "/admin/users", 
          label: "Manajemen User", 
          icon: FaUsers, 
          roles: ["admin"] 
      },
      { 
          path: "/admin/roles", 
          label: "Manajemen Role", 
          icon: FaUserShield, 
          roles: ["admin"] 
      },
      { 
          path: "/admin/system-lock", 
          label: "Kunci Sistem", 
          icon: FaLock, 
          roles: ["admin"] 
      },

      // Owner Only
      { 
          path: "/owner/transactions", 
          label: "Laporan Penjualan", 
          icon: FaClipboardList, 
          roles: ["owner"] 
      },
      { 
          path: "/owner/products", 
          label: "Manajemen Menu", 
          icon: FaTags, 
          roles: ["owner"] 
      },

      // Kasir Only
      { 
          path: "/kasir/pos", 
          label: "Mesin Kasir", 
          icon: FaShoppingCart, 
          roles: ["kasir"] 
      },
      { 
          path: "/kasir/transactions", 
          label: "Riwayat Transaksi", 
          icon: FaHistory, 
          roles: ["kasir"] 
      }
  ];

  // Filter items based on user roles
  // Logic: Show item if user has AT LEAST ONE of the required roles for that item
  // Filter items based on user roles
  // Logic: Show item if user has AT LEAST ONE of the required roles for that item
  // Filter items based on user roles
  // Logic: Show item if user has AT LEAST ONE of the required roles for that item
  // REVISION: Show ALL items as per user request to display full menu structure
  const visibleMenuItems = allMenuItems;

  // Dynamic Title based on Role
  const appTitle = hasRole("admin") ? "AdminPro" : hasRole("owner") ? "OwnerPanel" : "KasirApp";
  const appSubtitle = user.username.toUpperCase();

  return (
    <div className="min-h-screen bg-[#f8fafc] flex relative font-sans">
      <Sidebar 
        menuItems={visibleMenuItems} 
        title={appTitle} 
        subtitle={appSubtitle} 
      />
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Navbar 
          title="Dashboard" 
          subtitle={`Halo, ${user?.username || 'User'}`} 
        />
        <main className="flex-1 mt-20 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
