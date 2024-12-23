import Sidebar from "@/pages/admin/sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar remains fixed to the left */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow p-4 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
