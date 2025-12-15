import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading, hasRole } = useAuth();

  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles.length > 0) {
      const isAuthorized = allowedRoles.some(role => hasRole(role));
      if (!isAuthorized) {
          return (
             <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-4xl mb-4">
                    ⚠️
                </div>
                <h1 className="text-2xl font-black text-gray-900 mb-2">Akses Tidak Tersedia</h1>
                <p className="text-gray-500 max-w-md">
                    Menu ini tidak tersedia untuk role Anda saat ini.
                    Silakan hubungi administrator jika Anda memerlukan akses tambahan.
                </p>
             </div>
          );
      }
  }

  return children;
}
