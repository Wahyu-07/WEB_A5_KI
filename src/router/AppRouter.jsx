import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Login from "../pages/auth/Login";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../layout/MainLayout";

// Pages
import DashboardAdmin from "../pages/admin/DashboardAdmin";
import UserManagement from "../pages/admin/UserManagement";
import RoleManagement from "../pages/admin/RoleManagement";
import SystemLock from "../pages/admin/SystemLock";

import DashboardKasir from "../pages/kasir/DashboardKasir";
import SubProductManagement from "../pages/kasir/ProductManagement"; // Renamed to avoid partial overlap if needed, though likely unused for Owner
import POS from "../pages/kasir/POS";
import TransactionHistory from "../pages/kasir/TransactionHistory";

import DashboardOwner from "../pages/owner/DashboardOwner";
import OwnerProductManagement from "../pages/owner/ProductManagement";
import OwnerTransactionHistory from "../pages/owner/TransactionHistory";


// Helper to route to correct dashboard based on priority
function DashboardRouter() {
    const { hasRole } = useAuth();
    if (hasRole("admin")) return <DashboardAdmin />;
    if (hasRole("owner")) return <DashboardOwner />;
    if (hasRole("kasir")) return <DashboardKasir />;
    return <div className="p-10 text-center">Anda tidak memiliki akses dashboard utama.</div>;
}

// Just a wrapper to use hook inside component
function DashboardWrapper() {
    return <DashboardRouter />;
}


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        
        {/* Main App Routes - Wrapped in MainLayout */}
        <Route element={<MainLayout />}>
            
            {/* Universal Dashboard - Content changes based on Role priority */}
            <Route path="/dashboard" element={<DashboardWrapper />} />

            {/* --- ADMIN ROUTES --- */}
            <Route path="/admin/users" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                    <UserManagement />
                </ProtectedRoute>
            } />
            <Route path="/admin/roles" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                    <RoleManagement />
                </ProtectedRoute>
            } />
            <Route path="/admin/system-lock" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                    <SystemLock />
                </ProtectedRoute>
            } />

            {/* --- OWNER ROUTES --- */}
            <Route path="/owner/transactions" element={
                <ProtectedRoute allowedRoles={["owner"]}>
                    <OwnerTransactionHistory />
                </ProtectedRoute>
            } />
            <Route path="/owner/products" element={
                <ProtectedRoute allowedRoles={["owner"]}>
                    <OwnerProductManagement />
                </ProtectedRoute>
            } />

            {/* --- KASIR ROUTES --- */}
             <Route path="/kasir/pos" element={
                <ProtectedRoute allowedRoles={["kasir"]}>
                    <POS />
                </ProtectedRoute>
            } />
             <Route path="/kasir/transactions" element={
                <ProtectedRoute allowedRoles={["kasir"]}>
                    <TransactionHistory />
                </ProtectedRoute>
            } />

            {/* Legacy Redirects or Overlaps could be handled here if needed */}
        </Route>

        {/* 404 */}
        <Route path="*" element={<div className="p-10 text-center font-bold">Halaman tidak ditemukan</div>} />
      </Routes>
    </BrowserRouter>
  );
}
