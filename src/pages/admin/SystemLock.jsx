import { useState, useEffect, useRef } from "react";
import { getLoginAttempts, unlockUser } from "../../api/logs";
import { FaLock, FaUnlock, FaShieldAlt, FaChevronUp, FaChevronDown } from "react-icons/fa";

export default function SystemLock() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getLoginAttempts();
      setAttempts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async (userId) => {
    if (!confirm("Buka kunci user ini?")) return;
    try {
        await unlockUser(userId);
        alert("User berhasil di-unlock.");
        fetchData();
    } catch(err) {
        alert("Gagal: " + err.message);
    }
  };

  const lockedUsers = attempts.filter(a => a.locked_until && new Date(a.locked_until) > new Date());

  return (
    <div className="font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Monitoring Keamanan & System Lock</h1>
        <p className="text-gray-500 mt-1">Pantau percobaan login gagal dan buka kunci pengguna.</p>
      </div>

      {/* Alert Status */}
      <div className={`p-6 rounded-2xl border mb-8 flex items-center gap-5 transition-all ${
          lockedUsers.length > 0 
          ? 'bg-red-50 border-red-100 text-red-900' 
          : 'bg-green-50 border-green-100 text-green-900'
      }`}>
        <div className={`p-3 rounded-full ${
            lockedUsers.length > 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
        }`}>
            <FaShieldAlt size={24} />
        </div>
        <div>
            <h3 className="font-bold text-lg">{lockedUsers.length > 0 ? "PERINGATAN: User Terkunci Terdeteksi" : "Sistem Aman"}</h3>
            <p className="text-sm opacity-90">{lockedUsers.length > 0 ? "Ada user yang terdeteksi melakukan percobaan login mencurigakan." : "Tidak ada user yang terkunci saat ini."}</p>
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
                        <th className="px-6 py-4 rounded-tl-xl text-center">Pengguna</th>
                        <th className="px-6 py-4 text-center">Percobaan Gagal</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 rounded-tr-xl text-center">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                    {loading ? (
                        <tr><td colSpan="4" className="px-6 py-10 text-center font-medium text-gray-400">Memuat data...</td></tr>
                    ) : attempts.length === 0 ? (
                        <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-500">Tidak ada data percobaan login.</td></tr>
                    ) : attempts.map(item => {
                        const isLocked = item.locked_until && new Date(item.locked_until) > new Date();
                        return (
                            <tr key={item.id} className={`transition-colors even:bg-gray-50/50 ${isLocked ? 'bg-red-50/50 hover:bg-red-50' : 'hover:bg-amber-50/50'}`}>
                                <td className="px-6 py-4 text-gray-800 font-bold">
                                    {item.user?.username || `User #${item.user_id}`}
                                </td>
                                <td className="px-6 py-4 font-mono text-gray-600">
                                    <div className="flex flex-col text-center">
                                        <span className="font-black text-lg">{item.attempts || "5+"}x</span>
                                        <span className="text-[10px] uppercase font-bold text-red-500 tracking-wide bg-red-50 px-2 py-0.5 rounded-full border border-red-100 mx-auto mt-1">
                                            Salah Password
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {isLocked ? (
                                        <div className="flex flex-col items-center">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border bg-red-100 text-red-700 border-red-200">
                                                <FaLock size={10} /> TERKUNCI
                                            </span>
                                            <span className="text-[10px] text-gray-400 mt-1 font-mono">Sampai {new Date(item.locked_until).toLocaleTimeString()}</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border bg-green-50 text-green-700 border-green-100">
                                                AMAN
                                            </span>
                                            <span className="text-[10px] text-gray-400 mt-1">Unlocked manual</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {isLocked && (
                                        <div className="flex justify-center">
                                            <button onClick={() => handleUnlock(item.user_id)} 
                                                className="flex items-center gap-1.5 px-3 py-2 bg-white text-green-700 border border-green-200 rounded-lg font-bold hover:bg-green-50 shadow-sm transition-all text-xs">
                                                <FaUnlock size={12} /> Buka Kunci
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}
