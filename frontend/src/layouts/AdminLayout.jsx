import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-slate-900 text-white">
      
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </div>

    </div>
  );
}