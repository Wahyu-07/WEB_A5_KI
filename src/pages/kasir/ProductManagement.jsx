import { useState, useEffect, useRef } from "react";
import { getAllProducts, createProduct, updateProduct, deleteProduct } from "../../api/products";
import { FaPlus, FaEdit, FaTrash, FaBoxOpen, FaSearch, FaTimes, FaChevronUp, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", price: "", stock: "" });
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
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(Array.isArray(data) ? data : (data.data || []));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const payload = {
            name: formData.name,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock)
        };

        if (editingId) {
            await updateProduct(editingId, payload);
        } else {
            await createProduct(payload);
        }
        
        setShowModal(false);
        setFormData({ name: "", price: "", stock: "" });
        setEditingId(null);
        fetchProducts();
    } catch (err) {
        alert("Gagal menyimpan produk: " + err.message);
    }
  };

  const handleEdit = (product) => {
    setFormData({ name: product.name, price: product.price, stock: product.stock });
    setEditingId(product.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if(!confirm("Yakin ingin menghapus produk ini?")) return;
    try {
        await deleteProduct(id);
        fetchProducts();
    } catch (err) {
        alert("Gagal menghapus: " + err.message);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="font-sans">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manajemen Menu</h1>
           <p className="text-gray-500 mt-1">Kelola daftar menu, update harga, dan stok.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
             <div className="relative group flex-1 md:flex-none">
                <input 
                    type="text" 
                    placeholder="Cari menu..." 
                    className="w-full md:w-64 pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
             </div>
             <button onClick={() => { setShowModal(true); setEditingId(null); setFormData({name:"", price:"", stock:""}); }} 
                className="bg-gray-900 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95 font-bold whitespace-nowrap">
                <FaPlus size={14} /> Tambah Menu
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
            <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-20 shadow-sm">
                    <tr className="bg-gray-900 text-white text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                        <th className="px-6 py-4 rounded-tl-xl">Nama Menu</th>
                        <th className="px-6 py-4">Harga (Rp)</th>
                        <th className="px-6 py-4">Stok</th>
                        <th className="px-6 py-4 text-right rounded-tr-xl">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {loading ? (
                        <tr><td colSpan="4" className="px-6 py-10 text-center font-medium text-gray-400">Memuat data menu...</td></tr>
                    ) : filteredProducts.length === 0 ? (
                        <tr><td colSpan="4" className="px-6 py-10 text-center text-gray-500">Menu tidak ditemukan.</td></tr>
                    ) : filteredProducts.map(p => (
                        <tr key={p.id} className="group hover:bg-amber-50/50 transition-colors even:bg-gray-50/50">
                            <td className="px-6 py-4">
                                <span className="font-bold text-gray-800">{p.name}</span>
                            </td>
                            <td className="px-6 py-4 font-mono text-sm text-gray-600">
                                {new Intl.NumberFormat('id-ID').format(p.price)}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold ${
                                    p.stock < 10 
                                    ? 'bg-red-50 text-red-600 border border-red-100' 
                                    : 'bg-green-50 text-green-600 border border-green-100'
                                }`}>
                                    {p.stock} Pcs
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => handleEdit(p)} className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg transition-colors text-xs font-bold border border-amber-100 shadow-sm"><FaEdit /> Edit</button>
                                    <button onClick={() => handleDelete(p.id)} className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition-colors text-xs font-bold border border-red-100 shadow-sm"><FaTrash /> Hapus</button>
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
                    className="relative bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div>
                             <h2 className="text-2xl font-bold text-gray-900">
                                {editingId ? "Edit Product" : "New Product"}
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">Fill in the details below.</p>
                        </div>
                        <button onClick={() => setShowModal(false)} className="p-2 bg-gray-50 rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
                            <FaTimes />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="group">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Product Name</label>
                            <input type="text" className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                                placeholder="e.g. Latte Macchiato"
                                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="group">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Price</label>
                                <input type="number" className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                                    placeholder="0"
                                    value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                            </div>
                            <div className="group">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Stock</label>
                                <input type="number" className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                                    placeholder="0"
                                    value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-50">
                            <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
                            <button type="submit" className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black shadow-lg hover:shadow-xl active:scale-95 transition-all">Save Changes</button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}
