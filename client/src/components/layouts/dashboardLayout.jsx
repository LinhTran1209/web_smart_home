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
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
