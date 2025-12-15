import { useState, useEffect, useRef, useCallback } from "react";
import { getLoginLogs, getCrudLogs } from "../../api/logs";
import { motion } from "framer-motion";
import { FaClock, FaHistory, FaNetworkWired, FaUsers, FaChartLine, FaKey, FaDatabase, FaChevronUp, FaChevronDown, FaCalendarAlt, FaFilter, FaRedo } from "react-icons/fa";

export default function DashboardAdmin() {
  const [loginLogs, setLoginLogs] = useState([]);
  const [crudLogs, setCrudLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeFilter, setActiveFilter] = useState({ startDate: "", endDate: "" });

  const loginTableRef = useRef(null);
  const crudTableRef = useRef(null);

  const scrollTable = (ref, direction) => {
    if (ref.current) {
        const scrollAmount = 200;
        ref.current.scrollBy({ 
            top: direction === 'up' ? -scrollAmount : scrollAmount, 
            behavior: 'smooth' 
        });
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const params = {};
      if (activeFilter.startDate) params.startDate = activeFilter.startDate;
      if (activeFilter.endDate) params.endDate = activeFilter.endDate;

      const [loginData, crudData] = await Promise.all([
           getLoginLogs(params),
           getCrudLogs(params)
      ]);
      // Transform Login Logs
      const rawLoginLogs = Array.isArray(loginData) ? loginData : [];
      const formattedLoginLogs = rawLoginLogs.map(log => ({
          id: log.id,
          user: log.user?.username || "Unknown",
          role: "User", // Default, or log.user.roles if available
          timestamp: new Date(log.createdAt).toLocaleString(),
          status: log.action.includes("berhasil") ? "Berhasil" : "Gagal"
      }));

      // Transform CRUD Logs
      const rawCrudLogs = Array.isArray(crudData) ? crudData : [];
      
      const getReadableAction = (act, table) => {
          const a = act?.toUpperCase();
          const t = table?.toUpperCase();
          
          if (t === "PRODUCTS") {
              if (a === "CREATE") return "Tambah Menu";
              if (a === "UPDATE") return "Update Menu";
              if (a === "DELETE") return "Hapus Menu";
          }
          if (t === "USERS") {
              if (a === "CREATE") return "Tambah User";
              if (a === "UPDATE") return "Update User";
              if (a === "DELETE") return "Hapus User";
          }
          if (t === "ROLES") {
              if (a === "CREATE") return "Tambah Role";
              if (a === "UPDATE") return "Update Role";
              if (a === "DELETE") return "Hapus Role";
          }
          
          // Fallback translations
          if (a === "CREATE") return `Tambah ${table}`;
          if (a === "UPDATE") return `Update ${table}`;
          if (a === "DELETE") return `Hapus ${table}`;
          
          return act;
      };

      const formattedCrudLogs = rawCrudLogs.map(log => ({
          id: log.id,
          action: getReadableAction(log.action, log.table_name || ""),
          user: log.user?.username || "System",
          target: log.table_name || log.description,
          timestamp: new Date(log.created_at).toLocaleString()
      }));

      setLoginLogs(formattedLoginLogs);
      setCrudLogs(formattedCrudLogs);
    } catch (e) {
      console.error("Dashboard error:", e);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    fetchData(); // Initial fetch
    
    // Real-time polling (5 seconds)
    const interval = setInterval(fetchData, 5000); 

    return () => clearInterval(interval);
  }, [fetchData]);

  const handleApplyFilter = () => {
      setActiveFilter({ startDate, endDate });
      setLoading(true);
  };

  const handleResetFilter = () => {
      setStartDate("");
      setEndDate("");
      setActiveFilter({ startDate: "", endDate: "" });
      setLoading(true);
  };

  return (
    <div className="space-y-8 font-sans">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Ringkasan Sistem</h1>
                <p className="text-gray-500 mt-1">Pemantauan aktivitas pengguna dan operasional secara real-time.</p>
            </div>
            
            {/* Date Filter Controls */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center gap-2">
                <div className="flex items-center bg-gray-50 rounded-xl px-3 py-2 border border-gray-200">
                    <FaCalendarAlt className="text-gray-400 mr-2" />
                    <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-transparent outline-none text-sm text-gray-700 font-medium"
                    />
                </div>
                <span className="text-gray-400 font-bold">-</span>
                <div className="flex items-center bg-gray-50 rounded-xl px-3 py-2 border border-gray-200">
                    <FaCalendarAlt className="text-gray-400 mr-2" />
                    <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-transparent outline-none text-sm text-gray-700 font-medium"
                    />
                </div>
                <button 
                    onClick={handleApplyFilter}
                    disabled={!startDate && !endDate}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-all text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FaFilter size={12} /> Filter
                </button>
                 {(activeFilter.startDate || activeFilter.endDate) && (
                    <button 
                        onClick={handleResetFilter}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 transition-all text-sm font-bold"
                        title="Reset Filter"
                    >
                        <FaRedo size={12} /> Isikan Ulang
                    </button>
                )}
            </div>
        </header>

        {/* Mock Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                    <FaUsers />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">{loginLogs.length}</h3>
                    <p className="text-sm text-gray-500 font-medium">Total Login {(activeFilter.startDate || activeFilter.endDate) ? '(Filtered)' : ''}</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-xl">
                    <FaChartLine />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">{crudLogs.length}</h3>
                    <p className="text-sm text-gray-500 font-medium">Aktivitas Operasional</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
                    <FaHistory />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">24j</h3>
                    <p className="text-sm text-gray-500 font-medium">Waktu Aktif</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Login Logs */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[500px]">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                    <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <FaKey size={14} />
                        </div>
                        Riwayat Login
                    </h2>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => scrollTable(loginTableRef, 'up')} 
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors shadow-sm"
                            title="Scroll Atas"
                        >
                            <FaChevronUp size={12} />
                        </button>
                        <button 
                            onClick={() => scrollTable(loginTableRef, 'down')} 
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors shadow-sm"
                            title="Scroll Bawah"
                        >
                            <FaChevronDown size={12} />
                        </button>
                    </div>
                </div>
                
                <div ref={loginTableRef} className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar relative">
                    <table className="w-full text-center border-collapse">
                        <thead className="sticky top-0 z-20 shadow-sm">
                            <tr className="bg-gray-900 text-white text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4 text-center">Pengguna</th>
                                <th className="px-6 py-4 text-center">Role</th>
                                <th className="px-6 py-4 text-center">Waktu</th>
                                <th className="px-6 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm bg-white">
                            {loading ? (
                                <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-400">Memuat data...</td></tr>
                            ) : loginLogs.length > 0 ? (
                                loginLogs.map((l, index) => (
                                    <tr key={l.id || index} className="hover:bg-amber-50/50 transition-colors even:bg-gray-50/50">
                                        <td className="px-6 py-4 font-bold text-gray-800">
                                            {l.user}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {l.role}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                                            {l.timestamp}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${
                                                l.status === 'Berhasil' 
                                                ? 'bg-green-50 text-green-700 border-green-100' 
                                                : 'bg-red-50 text-red-700 border-red-100'
                                            }`}>
                                                {l.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-400">Tidak ada data login</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CRUD Logs */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[500px]">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                    <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                             <FaDatabase size={14} />
                        </div>
                        Riwayat Operasional
                    </h2>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => scrollTable(crudTableRef, 'up')} 
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors shadow-sm"
                            title="Scroll Atas"
                        >
                            <FaChevronUp size={12} />
                        </button>
                        <button 
                            onClick={() => scrollTable(crudTableRef, 'down')} 
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors shadow-sm"
                            title="Scroll Bawah"
                        >
                            <FaChevronDown size={12} />
                        </button>
                    </div>
                </div>
                
                <div ref={crudTableRef} className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar relative">
                    <table className="w-full text-center border-collapse">
                        <thead className="sticky top-0 z-20 shadow-sm">
                            <tr className="bg-gray-900 text-white text-xs font-bold uppercase tracking-wider">
                                <th className="px-6 py-4 text-center">Aktivitas</th>
                                <th className="px-6 py-4 text-center">Pengguna</th>
                                <th className="px-6 py-4 text-center">Target</th>
                                <th className="px-6 py-4 text-center">Waktu</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm bg-white">
                            {loading ? (
                                <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-400">Memuat data...</td></tr>
                            ) : crudLogs.length > 0 ? (
                                crudLogs.map((l, index) => (
                                    <tr key={l.id || index} className="hover:bg-amber-50/50 transition-colors even:bg-gray-50/50">
                                        <td className="px-6 py-4 text-gray-800 font-bold">
                                            {l.action}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {l.user}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded border border-gray-200">{l.target}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                                            {l.timestamp}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-400">Tidak ada aktivitas operasional</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </div>
  );
}
