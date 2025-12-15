import { useState, useEffect, useRef } from "react";
import { getAllUsers } from "../../api/users";
import { updateUserRole } from "../../api/roles";
import { FaUserShield, FaEdit, FaCheck, FaChevronUp, FaChevronDown } from "react-icons/fa";

export default function RoleManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for tracking which user is being edited
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  
  const tableRef = useRef(null);
  
  const scrollTable = (direction) => {
    if (tableRef.current) {
        const scrollAmount = 200;
        tableRef.current.scrollBy({ 
            top: direction === 'up' ? -scrollAmount : scrollAmount, 
            behavior: 'smooth' 
        });
    }
  };

  const AVAILABLE_ROLES = ["admin", "kasir", "owner"];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      // Ensure data has role arrays
      const normalizedUsers = (Array.isArray(data) ? data : []).map(u => ({
          ...u,
          role: Array.isArray(u.role) ? u.role : [u.role]
      }));
      setUsers(normalizedUsers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (user) => {
      setEditingUserId(user.id);
      // Ensure initial value is array
      setSelectedRoles(Array.isArray(user.role) ? user.role : [user.role]); 
  };

  const toggleRole = (role) => {
      setSelectedRoles(prev => 
         prev.includes(role) 
            ? prev.filter(r => r !== role)
            : [...prev, role]
      );
  };

  // Role Mapping: ADMIN=1, KASIR=2, OWNER=3
  const ROLE_MAP = {
      'admin': 1,
      'kasir': 2,
      'owner': 3
  };

  const handleSave = async (userId) => {
      try {
          if (selectedRoles.length === 0) {
              alert("User harus memiliki setidaknya satu role.");
              return;
          }

          // Transform selectedRoles (strings) to role IDs (integers)
          const roleIds = selectedRoles
              .map(r => ROLE_MAP[r.toLowerCase()])
              .filter(id => id !== undefined);

          await updateUserRole(userId, roleIds); // Send IDs array
          
          setEditingUserId(null);
          // Refresh data locally
          setUsers(users.map(u => u.id === userId ? { ...u, role: selectedRoles } : u));
          alert("Role berhasil diperbarui!");
      } catch (err) {
          alert("Gagal update role: " + err.message);
      }
  };

  const cancelEdit = () => {
      setEditingUserId(null);
      setSelectedRoles([]);
  };

  return (
    <div className="font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manajemen Role & Akses</h1>
            <p className="text-gray-500 mt-1">Atur hak akses pengguna dalam sistem.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px]">
        <div className="p-4 border-b border-gray-100 flex items-center justify-end bg-white z-10 gap-2">
            <button 
                onClick={() => scrollTable('up')} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors shadow-sm"
                title="Scroll Atas"
            >
                <FaChevronUp size={12} />
            </button>
            <button 
                onClick={() => scrollTable('down')} 
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors shadow-sm"
                title="Scroll Bawah"
            >
                <FaChevronDown size={12} />
            </button>
        </div>
        <div ref={tableRef} className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar relative">
            <table className="w-full text-center border-collapse">
                <thead className="sticky top-0 z-20 shadow-sm">
                    <tr className="bg-gray-900 text-white text-xs font-bold uppercase tracking-wider">
                        <th className="px-6 py-4 rounded-tl-xl text-center">Username</th>
                        <th className="px-6 py-4 text-center">Email</th>
                        <th className="px-6 py-4 text-center">Role Saat Ini</th>
                        <th className="px-6 py-4 rounded-tr-xl text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                    {loading ? (
                        <tr><td colSpan="4" className="px-6 py-10 text-center font-medium text-gray-400">Memuat data...</td></tr>
                    ) : users.map(user => (
                        <tr key={user.id} className="hover:bg-amber-50/50 transition-colors even:bg-gray-50/50">
                            <td className="px-6 py-4 font-bold text-gray-800">{user.username}</td>
                            <td className="px-6 py-4 text-gray-600">{user.email || "-"}</td>
                            <td className="px-6 py-4">
                                {editingUserId === user.id ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <p className="text-xs text-gray-500 mb-1">Pilih Multi Role:</p>
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            {AVAILABLE_ROLES.map(role => (
                                                <label key={role} className={`flex items-center gap-1.5 cursor-pointer px-2 py-1 rounded border transition-all ${selectedRoles.includes(role) ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-gray-200 text-gray-500'}`}>
                                                    <input 
                                                        type="checkbox" 
                                                        value={role}
                                                        checked={selectedRoles.includes(role)}
                                                        onChange={() => toggleRole(role)}
                                                        className="accent-amber-600 w-3.5 h-3.5 cursor-pointer"
                                                    />
                                                    <span className="capitalize font-bold text-xs select-none">{role}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-1 justify-center">
                                        {(Array.isArray(user.role) ? user.role : [user.role]).map((r, idx) => (
                                            <span key={idx} className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${
                                                r === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' : 
                                                r === 'owner' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                                                'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                                {r}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                {editingUserId === user.id ? (
                                    <div className="flex justify-center gap-2">
                                        <button onClick={cancelEdit} className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-700">Batal</button>
                                        <button onClick={() => handleSave(user.id)} className="px-3 py-1.5 text-xs bg-gray-900 text-white font-bold rounded-lg hover:bg-black flex items-center gap-1 shadow-sm">
                                            <FaCheck size={10} /> Simpan
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex justify-center">
                                        <button onClick={() => startEdit(user)} className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg transition-colors text-xs font-bold border border-amber-100 shadow-sm">
                                            <FaEdit size={12} /> Ubah Role
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
