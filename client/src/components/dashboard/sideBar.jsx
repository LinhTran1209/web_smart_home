import { NavLink } from "react-router-dom";
import {
  Home,
  Lamp,
  BarChart3,
  Users,
  Shield,
  LogOut,
} from "lucide-react";

import "../../assets/styles/sidebar.css";

const SideBar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="./public/icon_logo.png" alt="VO" />
      </div>

      <nav className="sidebar-nav">
        <NavLink
          to=""
          end
          className={({ isActive }) =>
            "sidebar-item" + (isActive ? " active" : "")
          }
        >
          <Home size={20} />
        </NavLink>

        <NavLink
          to="/devices"
          className={({ isActive }) =>
            "sidebar-item" + (isActive ? " active" : "")
          }
        >
          <Lamp size={20} />
        </NavLink>

        <NavLink
          to="/members"
          className={({ isActive }) =>
            "sidebar-item" + (isActive ? " active" : "")
          }
        >
          <Users size={20} />
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            "sidebar-item" + (isActive ? " active" : "")
          }
        >
          <BarChart3 size={20} />
        </NavLink>

        <NavLink
          to="/security"
          className={({ isActive }) =>
            "sidebar-item" + (isActive ? " active" : "")
          }
        >
          <Shield size={20} />
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <LogOut size={20} />
      </div>
    </aside>
  );
};

export default SideBar;
