import { useState, useEffect, useRef } from "react";
import { getAllOrders } from "../../api/orders";
import { motion } from "framer-motion";
import { FaHistory, FaSearch, FaReceipt, FaCalendarAlt, FaUser, FaChevronUp, FaChevronDown, FaFilter, FaRedo, FaMoneyBillWave } from "react-icons/fa";

export default function TransactionHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filter States
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredRevenue, setFilteredRevenue] = useState(0);

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

  const fetchOrders = async (params = {}) => {
    setLoading(true);
    try {
      const data = await getAllOrders(params);
      const ordersData = Array.isArray(data) ? data : [];
      setOrders(ordersData);
      
      // Calculate revenue based on fetched (filtered) data
      const total = ordersData.reduce((acc, order) => {
          return acc + (Number(order.total) || Number(order.total_amount) || 0);
      }, 0);
      setFilteredRevenue(total);

    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleApplyFilter = () => {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      fetchOrders(params);
  };

  const handleResetFilter = () => {
      setStartDate("");
      setEndDate("");
      fetchOrders();
  };

  // Filter orders by search term logic (client-side)
  // Date filtering logic is now handled server-side via fetchOrders
  const filteredOrders = orders.filter(order => 
      (order.id?.toString().includes(searchTerm)) ||
      (order.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="font-sans space-y-8 relative">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
             <FaHistory className="text-amber-500" /> Laporan Penjualan
          </h1>
          <p className="text-gray-500 mt-1">Pantau performa penjualan harian.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
            <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
            <input 
                type="text" 
                placeholder="Cari Order ID atau Kasir..." 
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </header>

      {/* Filter & Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Filter */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaCalendarAlt className="text-amber-500" /> Filter Tanggal
            </h3>
            <div className="flex flex-wrap items-center gap-3">
                <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="flex-1 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200 outline-none text-sm font-medium focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
                <span className="text-gray-400 font-bold">-</span>
                <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="flex-1 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200 outline-none text-sm font-medium focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
            </div>
            <div className="flex justify-end gap-2 mt-4">
                 {(startDate || endDate) && (
                    <button 
                        onClick={handleResetFilter}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 transition-all text-sm font-bold"
                    >
                        <FaRedo size={12} /> Reset
                    </button>
                )}
                <button 
                    onClick={handleApplyFilter}
                    disabled={!startDate && !endDate}
                     className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-xl hover:bg-black transition-all text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FaFilter size={12} /> Terapkan Filter
                </button>
            </div>
        </div>

        {/* Revenue Stats */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full translate-x-10 -translate-y-10"></div>
            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-green-50 to-green-100 text-green-600 flex items-center justify-center text-4xl shadow-sm z-10">
                <FaMoneyBillWave />
            </div>
            <div className="z-10">
                <p className="text-gray-500 font-bold mb-1">Total Pendapatan Terfilter</p>
                <h3 className="text-4xl font-black text-gray-900 tracking-tight">
                   Rp {filteredRevenue.toLocaleString()}
                </h3>
                <p className="text-xs text-gray-400 mt-2 font-medium">
                    {startDate && endDate ? `${new Date(startDate).toLocaleDateString()} s/d ${new Date(endDate).toLocaleDateString()}` : "Semua Waktu"}
                </p>
            </div>
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
                <th className="px-6 py-4 rounded-tl-xl text-center">Order ID</th>
                <th className="px-6 py-4 text-center">Tanggal</th>
                <th className="px-6 py-4 text-center">Kasir</th>
                <th className="px-6 py-4 text-center">Jumlah Item</th>
                <th className="px-6 py-4 text-center">Struk</th>
                <th className="px-6 py-4 rounded-tr-xl text-center">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-10 text-center font-medium text-gray-400">Memuat transaksi...</td></tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={order.id || index} 
                    onClick={() => setSelectedOrder(order)}
                    className="hover:bg-amber-50/50 transition-colors even:bg-gray-50/50 cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-700 group-hover:text-amber-600 transition-colors">#{order.id}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                       <div className="flex flex-col items-center">
                           <span className="font-bold">{new Date(order.created_at || order.createdAt).toLocaleDateString("id-ID")}</span>
                           <span className="text-xs text-gray-400 font-mono">{new Date(order.created_at || order.createdAt).toLocaleTimeString("id-ID")}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">
                                {(order.user?.username || "K").charAt(0).toUpperCase()}
                            </div>
                            {order.user?.username || "Kasir"}
                        </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                        {order.items?.length || 0} Item
                    </td>
                     <td className="px-6 py-4 text-center">
                          <button onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }} className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold hover:bg-amber-100 hover:text-amber-700 transition-colors border border-gray-200 shadow-sm">
                              Lihat Struk
                          </button>
                      </td>
                    <td className="px-6 py-4 font-bold text-gray-900 text-lg">
                      Rp {(Number(order.total) || Number(order.total_amount) || 0).toLocaleString()}
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr><td colSpan="6" className="px-6 py-10 text-center text-gray-400">Tidak ada transaksi ditemukan</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

       {/* Transaction Detail Modal */}
       {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-amber-400 p-6 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-amber-500 to-yellow-300"></div>
                    <h2 className="text-2xl font-black text-amber-950 uppercase tracking-widest mb-1">Struk Belanja</h2>
                    <p className="text-amber-900 font-mono text-sm opacity-80">#{selectedOrder.id}</p>
                    <button 
                        onClick={() => setSelectedOrder(null)}
                        className="absolute top-4 right-4 w-8 h-8 bg-black/10 hover:bg-black/20 rounded-full text-amber-950 flex items-center justify-center transition-colors font-bold"
                    >&times;</button>
                </div>
                
                <div className="p-6 bg-gray-50 min-h-[300px] flex flex-col">
                    <div className="text-center mb-6">
                         <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Kasir</p>
                         <p className="font-bold text-gray-800 text-lg">{selectedOrder.user?.username || "Kasir"}</p>
                         <p className="text-xs text-gray-400 mt-1">{new Date(selectedOrder.created_at || selectedOrder.createdAt).toLocaleString("id-ID")}</p>
                    </div>

                    <div className="flex-1 space-y-3 mb-6">
                        {selectedOrder.items && selectedOrder.items.length > 0 ? (
                            selectedOrder.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-gray-800 text-sm">{item.product?.name || "Produk dihapus"}</span>
                                        <span className="text-xs text-gray-400">Qty: {item.quantity}</span>
                                    </div>
                                    <span className="font-bold text-gray-600 text-sm">
                                        Rp {(item.price * item.quantity).toLocaleString()}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-400 italic py-4">Tidak ada detail item.</div>
                        )}
                    </div>

                    <div className="border-t-2 border-dashed border-gray-300 pt-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-500 font-bold text-sm">Total Item</span>
                            <span className="text-gray-800 font-bold">{selectedOrder.items?.reduce((a, b) => a + b.quantity, 0) || 0}</span>
                        </div>
                        <div className="flex justify-between items-center text-xl font-black text-gray-900">
                            <span>TOTAL</span>
                            <span>Rp {(Number(selectedOrder.total) || Number(selectedOrder.total_amount) || 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                
                <div className="p-4 bg-white border-t border-gray-100 text-center">
                    <button onClick={() => setSelectedOrder(null)} className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
