import { Link } from "react-router-dom";
import { FaShoppingCart, FaBox, FaHistory } from "react-icons/fa";

export default function DashboardKasir() {
  const menus = [
      { title: "Start Transaction", desc: "Open POS terminal to serve customers.", icon: FaShoppingCart, path: "/kasir/pos", color: "bg-blue-50 text-blue-600" },
      { title: "Transaction History", desc: "View past sales and receipts.", icon: FaHistory, path: "/kasir/transactions", color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className="font-sans">
        <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Vending Overview</h1>
            <p className="text-gray-500 mt-1">Quick access to daily cashier operations.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menus.map((item, idx) => (
                <Link to={item.path} key={idx} className="block group">
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full relative overflow-hidden">
                        <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center text-2xl mb-6 shadow-sm`}>
                            <item.icon />
                        </div>
                        <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">{item.title}</h3>
                        <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                        
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-50 group-hover:bg-amber-500/20 transition-colors">
                            <div className="h-full bg-amber-500 w-0 group-hover:w-full transition-all duration-700 ease-out"></div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    </div>
  );
}
