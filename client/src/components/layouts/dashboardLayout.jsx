// src/components/layouts/dashboardLayout.jsx
import "../../assets/styles/dashboard.css";
import SideBar from "../dashboard/sideBar.jsx";
import TopBar from "../dashboard/topBar.jsx";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="app-shell">
      <SideBar />

      <div className="app-main">
        <TopBar />
        <main className="app-content">
          {/* Phần giữa thay đổi theo từng trang */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
