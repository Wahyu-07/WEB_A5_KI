import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage on initial load
    const initAuth = () => {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const decoded = jwtDecode(token);
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
               setUser(JSON.parse(storedUser));
            } else {
               setUser(decoded); 
            }
          } catch (error) {
            console.error("Invalid token:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        }
        setLoading(false);
    };

    initAuth();
  }, []);

  const login = (token, userData) => {
    // Ensure role is normalized to array
    const normalizedUser = {
        ...userData,
        role: Array.isArray(userData.role) ? userData.role : [userData.role]
    };
    
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    setUser(normalizedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  // Role Mapping: ADMIN=1, KASIR=2, OWNER=3
  const ROLE_MAP = {
      'admin': 1,
      'kasir': 2,
      'owner': 3
  };

  const hasRole = (requiredRole) => {
      if (!user || !user.roles) return false; // Note: Backend uses 'roles' (plural) containing IDs
      
      const userRoleIds = Array.isArray(user.roles) ? user.roles : [user.roles];
      const requiredRoleId = ROLE_MAP[requiredRole.toLowerCase()];

      if (!requiredRoleId) return false; // Unknown role name

      // Check if user has the required Role ID
      // userRoleIds might be array of integers [1, 2]
      return userRoleIds.includes(requiredRoleId);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, hasRole }}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-sans">
          Sedang Memuat Aplikasi...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
