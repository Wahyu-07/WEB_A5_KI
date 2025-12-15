import { useState, useEffect, useRef } from "react";
import { getAllUsers, createUser, updateUser, deleteUser } from "../../api/users";
import { FaUserPlus, FaEdit, FaTrash, FaUserTag, FaSearch, FaTimes, FaChevronUp, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "", roleId: "" });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
        const data = await getAllUsers();
        setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  const roles = [
    { id: 1, name: "Admin" },
    { id: 2, name: "Kasir" },
    { id: 3, name: "Owner" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        if (editingId) {
            // Update User
            await updateUser(editingId, {
                username: formData.username,
                password: formData.password || undefined // Only send if not empty
            });
        } else {
             // Create User
            await createUser({
                username: formData.username,
                password: formData.password,
                roles: [parseInt(formData.roleId)] 
            });
        }
        
        fetchUsers();
        setShowModal(false);
        setFormData({ username: "", password: "", roleId: "" });
        setEditingId(null);
    } catch (err) {
        alert("Gagal menyimpan: " + err.message);
    }
  };

  const handleEdit = (user) => {
      setFormData({ 
          username: user.username, 
          password: "", // Don't show hashed password
          roleId: "" // Role update not validated in this simplified form
      });
      setEditingId(user.id);
      setShowModal(true);
  };

  const handleDelete = async (id) => {
      if(!confirm("Yakin ingin menghapus user ini?")) return;
      try {
          await deleteUser(id);
          fetchUsers();
      } catch (err) {
          alert("Gagal menghapus: " + err.message);
      }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="font-sans">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manajemen Pengguna</h1>
           <p className="text-gray-500 mt-1">Kelola pengguna dan hak akses role mereka.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
             <div className="relative group flex-1 md:flex-none">
                <input 
                    type="text" 
                    placeholder="Cari pengguna..." 
                    className="w-full md:w-64 pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
             </div>
            <button onClick={() => { setShowModal(true); setEditingId(null); setFormData({username:"", password:"", roleId:""}); }} className="bg-gray-900 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95 font-bold whitespace-nowrap">
                <FaUserPlus size={14} /> Tambah User
            </button>
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
                        <th className="px-6 py-4 rounded-tl-xl text-center">ID</th>
                        <th className="px-6 py-4 text-center">Username</th>
                        <th className="px-6 py-4 text-center">Roles</th>
                        <th className="px-6 py-4 text-center rounded-tr-xl">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm bg-white">
                    {loading ? (
                         <tr><td colSpan="4" className="px-6 py-10 text-center font-medium text-gray-400">Memuat data...</td></tr>
                    ) : filteredUsers.length === 0 ? (
                        <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-500">Tidak ada pengguna ditemukan.</td></tr>
                    ) : filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-amber-50/50 transition-colors even:bg-gray-50/50">
                            <td className="px-6 py-4 text-gray-400 font-mono text-xs">#{user.id}</td>
                            <td className="px-6 py-4 font-bold text-gray-800">{user.username}</td>
                            <td className="px-6 py-4">
                                <div className="flex gap-1 flex-wrap justify-center">
                                    {(user.role || []).map((roleName, idx) => (
                                        <span key={idx} className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${
                                            roleName.toLowerCase() === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                            roleName.toLowerCase() === 'kasir' ? 'bg-green-50 text-green-700 border-green-100' :
                                            'bg-blue-50 text-blue-700 border-blue-100'
                                        }`}>
                                            {roleName}
                                        </span>
                                    ))}
                                    {(!user.role || user.role.length === 0) && <span className="text-gray-400 text-xs italic">Tanpa Role</span>}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex justify-center gap-2">
                                    <button onClick={() => handleEdit(user)} className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg transition-colors text-xs font-bold border border-amber-100 shadow-sm">
                                        <FaEdit size={12} /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(user.id)} className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition-colors text-xs font-bold border border-red-100 shadow-sm">
                                        <FaTrash size={12} /> Hapus
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    onClick={() => setShowModal(false)}
                    className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
                />
                
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                    animate={{ scale: 1, opacity: 1, y: 0 }} 
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl border border-gray-100"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div>
                             <h2 className="text-2xl font-bold text-gray-900">{editingId ? "Edit User" : "Tambah User"}</h2>
                            <p className="text-sm text-gray-500 mt-1">{editingId ? "Update informasi user." : "Buat akun baru untuk anggota tim."}</p>
                        </div>
                        <button onClick={() => setShowModal(false)} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
                            <FaTimes />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="group">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Username</label>
                            <input type="text" className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                                placeholder="Contoh: johndoe"
                                value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required />
                        </div>
                        <div className="group">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Password {editingId && <span className="text-xs font-normal normal-case text-gray-400">(Kosongkan jika tidak ubah)</span>}</label>
                            <input type="password" className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                                placeholder="••••••••"
                                value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required={!editingId} />
                        </div>
                        
                        {!editingId && (
                            <div className="group">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Role</label>
                                <div className="relative">
                                    <select className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all appearance-none" 
                                        value={formData.roleId} onChange={e => setFormData({...formData, roleId: e.target.value})} required
                                    >
                                        <option value="">Pilih Role</option>
                                        {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                                    </select>
                                    <div className="absolute right-4 top-4 pointer-events-none text-gray-400 text-xs">▼</div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-50">
                            <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-colors">Batal</button>
                            <button type="submit" className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black shadow-lg hover:shadow-xl active:scale-95 transition-all">{editingId ? "Simpan Perubahan" : "Buat Akun"}</button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}
