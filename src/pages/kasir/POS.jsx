import { useState, useEffect } from "react";
import { getAllProducts } from "../../api/products";
import { createOrder } from "../../api/orders";
import { addItemToOrder } from "../../api/orderItems";
import { FaShoppingCart, FaPlus, FaMinus, FaTimes, FaBoxOpen, FaReceipt, FaMoneyBillWave, FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function POS() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    getAllProducts().then(data => {
        setProducts(Array.isArray(data) ? data : (data.data || []));
        setLoading(false);
    }).catch(console.error);
  }, []);

  const addToCart = (product) => {
    setCart(prev => {
        const existing = prev.find(item => item.id === product.id);
        if (existing) {
            return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
        }
        return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
        if (item.id === id) {
            const newQty = Math.max(1, item.qty + delta);
            return { ...item, qty: newQty };
        }
        return item;
    }));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!confirm(`Proses transaksi senilai Rp ${totalAmount.toLocaleString()}?`)) return;
    
    setProcessing(true);
    try {
        const user = JSON.parse(localStorage.getItem("user")) || { id: 1 }; // Fallback for dummy
        const orderData = await createOrder({
            user_id: user.id, 
            total: totalAmount
        });

        const orderId = orderData.id || orderData.data?.id || orderData.order?.id;

        if (!orderId) throw new Error("Gagal membuat Order ID");

        for (const item of cart) {
            await addItemToOrder({
                order_id: orderId,
                product_id: item.id,
                quantity: item.qty,
                price: item.price
            });
        }

        alert("Transaksi Berhasil!");
        setCart([]);
    } catch (err) {
        console.error(err);
        alert("Transaksi Gagal: " + err.message);
    } finally {
        setProcessing(false);
    }
  };

  const filteredProducts = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === "All" || p.category === selectedCategory)
  );
  
  // Extract categories if available, else just mock
  const categories = ["All", ...new Set(products.map(p => p.category || "General"))].filter(Boolean);

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-8rem)] font-sans">
        {/* Catalog Section */}
        <div className="flex-1 flex flex-col gap-6">
            
            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Cari produk..." 
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-1 custom-scrollbar">
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                                selectedCategory === cat 
                                ? "bg-amber-500 text-white shadow-md shadow-amber-500/25" 
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {loading ? <div className="text-center p-10 text-gray-400">Memuat produk...</div> : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
                        {filteredProducts.map(p => (
                            <motion.div 
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                key={p.id} 
                                onClick={() => addToCart(p)} 
                                className="bg-white p-4 rounded-2xl border border-gray-100 cursor-pointer shadow-sm hover:shadow-lg hover:border-amber-200 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-2 bg-amber-50 rounded-bl-2xl text-xs font-bold text-amber-600">
                                    Stok: {p.stock}
                                </div>
                                <div className="h-28 bg-gray-50 rounded-xl mb-4 flex items-center justify-center text-4xl text-gray-300 group-hover:text-amber-500 group-hover:bg-amber-50 transition-colors">
                                    <FaBoxOpen />
                                </div>
                                <h3 className="font-bold text-gray-800 truncate text-sm mb-1">{p.name}</h3>
                                <div className="flex items-center justify-between">
                                    <p className="text-amber-600 font-bold">Rp {p.price.toLocaleString()}</p>
                                    <button className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all shadow-sm">
                                        <FaPlus size={12} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Cart Section */}
        <div className="w-full lg:w-[400px] bg-white rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h2 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-white text-sm">
                        <FaShoppingCart />
                    </div>
                     Pesanan Saat Ini
                </h2>
                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-md font-bold">{cart.reduce((a, b) => a + b.qty, 0)} Item</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-gray-50/30">
                <AnimatePresence>
                    {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-300">
                            <FaShoppingCart size={48} className="mb-4 opacity-20" />
                            <p className="font-medium text-sm">Keranjang kosong</p>
                            <p className="text-xs">Pilih produk untuk memulai pesanan</p>
                        </div>
                    ) : cart.map(item => (
                        <motion.div 
                            layout
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            key={item.id} 
                            className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm group"
                        >
                            <div className="flex-1">
                                <p className="font-bold text-sm text-gray-800">{item.name}</p>
                                <p className="text-xs text-amber-600 font-bold mt-0.5">@ Rp {item.price.toLocaleString()}</p>
                            </div>
                            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                                <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 bg-white rounded-md flex items-center justify-center text-xs text-gray-600 hover:text-red-500 shadow-sm transition-all"><FaMinus /></button>
                                <span className="font-bold text-sm w-4 text-center">{item.qty}</span>
                                <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 bg-white rounded-md flex items-center justify-center text-xs text-gray-600 hover:text-green-500 shadow-sm transition-all"><FaPlus /></button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="ml-3 text-gray-300 hover:text-red-500 transition-colors"><FaTimes /></button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="p-6 border-t border-gray-100 bg-white">
                <div className="flex justify-between items-center mb-2 text-gray-500 text-sm">
                    <span>Subtotal</span>
                    <span>Rp {totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-6 text-2xl font-black text-gray-900">
                    <span>Total</span>
                    <span>Rp {totalAmount.toLocaleString()}</span>
                </div>
                
                <button 
                    onClick={handleCheckout}
                    disabled={cart.length === 0 || processing}
                    className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:shadow-amber-500/20 active:scale-[0.98] flex items-center justify-center gap-2 group cursor-pointer"
                >
                    {processing ? (
                        "Memproses..." 
                    ) : (
                        <>
                            Bayar Sekarang <FaMoneyBillWave className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        </div>
    </div>
  );
}
