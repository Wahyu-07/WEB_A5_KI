import { useState, useEffect, useRef } from "react";
import { getAllOrders } from "../../api/orders";
import { FaMoneyBillWave, FaShoppingCart, FaBoxOpen, FaChevronUp, FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function DashboardOwner() {
  const [stats, setStats] = useState({ revenue: 0, orders: 0 });
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
    async function fetchStats() {
      try {
        const orders = await getAllOrders();
        
        // Pastikan total diparsing sebagai angka untuk akurasi
        const totalRevenue = orders.reduce((acc, order) => {
             const amount = Number(order.total) || Number(order.total_amount) || 0;
             return acc + amount;
        }, 0);

        setStats({
          revenue: totalRevenue,
          orders: orders.length
        });
        setAllOrders(orders);
      } catch (e) {
        console.error("Dashboard Owner Error", e);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="font-sans space-y-8 relative">
      <header>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Owner</h1>
          <p className="text-gray-500 mt-1">Ringkasan penjualan dan performa bisnis.</p>
      </header>
      
      {/* ... (Cards section unchanged) ... */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Revenue Card */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center text-3xl">
                  <FaMoneyBillWave />
              </div>
              <div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    Rp {stats.revenue.toLocaleString()}
                  </h3>
                  <p className="text-gray-500 font-medium mt-1">Total Pendapatan</p>
              </div>
          </div>

          {/* Orders Card */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-3xl">
                  <FaShoppingCart />
              </div>
              <div>
                  <h3 className="text-3xl font-bold text-gray-900">{stats.orders}</h3>
                  <p className="text-gray-500 font-medium mt-1">Total Pesanan</p>
              </div>
          </div>

           {/* Menu Card */}
           <Link to="/owner/products" className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-md transition-all cursor-pointer">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl">
                  <FaBoxOpen />
              </div>
              <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Kelola Menu</h3>
                  <p className="text-gray-500 font-medium mt-1">Update Produk</p>
              </div>
          </Link>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px]">
          <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white z-10">
              <div>
                  <h2 className="text-xl font-bold text-gray-900">Riwayat Transaksi Terbaru</h2>
                  <p className="text-gray-500 text-sm mt-1">Pantau aktivitas penjualan kasir secara real-time.</p>
              </div>
              <div className="flex gap-2">
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
          </div>
          <div ref={tableRef} className="overflow-x-auto overflow-y-auto flex-1 custom-scrollbar relative">
              <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 z-20 shadow-sm">
                      <tr className="bg-gray-900 text-white text-xs font-bold uppercase tracking-wider">
                          <th className="px-8 py-5 text-left rounded-tl-xl">ID Order</th>
                          <th className="px-8 py-5 text-left">Kasir</th>
                          <th className="px-8 py-5 text-left">Menu yang Dipesan</th>
                          <th className="px-8 py-5 text-center">Detail</th>
                          <th className="px-8 py-5 text-right rounded-tr-xl">Total Bayar</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                      {loading ? (
                          <tr><td colSpan="5" className="px-8 py-12 text-center text-gray-400">Memuat data transaksi...</td></tr>
                      ) : allOrders.length === 0 ? (
                          <tr><td colSpan="5" className="px-8 py-12 text-center text-gray-400">Belum ada transaksi.</td></tr>
                      ) : allOrders.slice(0, 10).map((order) => (
                          <tr 
                            key={order.id} 
                            onClick={() => setSelectedOrder(order)}
                            className="hover:bg-amber-50/30 transition-colors even:bg-gray-50/50 cursor-pointer group"
                          >
                              <td className="px-8 py-5 font-bold text-gray-900 group-hover:text-amber-600 transition-colors">#{order.id}</td>
                              <td className="px-8 py-5 text-gray-600 font-medium">
                                  <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-bold">
                                          {(order.user?.username || "K").charAt(0).toUpperCase()}
                                      </div>
                                      {order.user?.username || "Kasir"}
                                  </div>
                              </td>
                              <td className="px-8 py-5">
                                  <span className="text-gray-500 text-xs">
                                      {order.items?.length || 0} Item(s)
                                  </span>
                              </td>
                              <td className="px-8 py-5 text-center">
                                  <button onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }} className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold hover:bg-amber-100 hover:text-amber-700 transition-colors border border-gray-200 shadow-sm">
                                      Lihat Struk
                                  </button>
                              </td>
                              <td className="px-8 py-5 text-right font-bold text-gray-900 text-lg">
                                  Rp {(Number(order.total) || Number(order.total_amount) || 0).toLocaleString()}
                              </td>
                          </tr>
                      ))}
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
