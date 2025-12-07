import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Lamp,
  BarChart3,
  Users,
  Shield,
  LogOut,
  Building2 
} from "lucide-react";

import "../../assets/styles/sidebar.css";

const navItems = [
  { key: "home", to: "", icon: <Home size={20} />, exact: true },
  { key: "buildings", to: "/buildings", icon: <Building2 size={20} /> },
  { key: "devices", to: "/devices", icon: <Lamp size={20} /> },
  { key: "members", to: "/members", icon: <Users size={20} /> },
  { key: "analytics", to: "/analytics", icon: <BarChart3 size={20} /> },
  // { key: "security", to: "/security", icon: <Shield size={20} /> },
];

const SideBar = () => {
  const location = useLocation();
  const navRef = useRef(null);
  const [indicatorTop, setIndicatorTop] = useState(null);

  const updateIndicatorToActive = () => {
    if (!navRef.current) return;

    const activeEl =
      navRef.current.querySelector(".sidebar-item.active") ||
      navRef.current.querySelector(".sidebar-item");

    if (!activeEl) return;

    const navRect = navRef.current.getBoundingClientRect();
    const itemRect = activeEl.getBoundingClientRect();
    const centerY = itemRect.top - navRect.top + itemRect.height / 2;

    setIndicatorTop(centerY);
  };

  useEffect(() => {
    updateIndicatorToActive();
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => updateIndicatorToActive();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleItemHover = (e) => {
    if (!navRef.current) return;
    const navRect = navRef.current.getBoundingClientRect();
    const itemRect = e.currentTarget.getBoundingClientRect();
    const centerY = itemRect.top - navRect.top + itemRect.height / 2;
    setIndicatorTop(centerY);
  };

  const handleNavMouseLeave = () => {
    updateIndicatorToActive();
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <img src="/icon_logo.png" alt="VO" />
      </div>

      <nav
        className="sidebar-nav"
        ref={navRef}
        onMouseLeave={handleNavMouseLeave}
      >
        {indicatorTop !== null && (
          <div
            className="sidebar-cutout"
            style={{ top: `${indicatorTop}px` }}
          />
        )}

        {navItems.map((item) => (
          <NavLink
            key={item.key}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              "sidebar-item" + (isActive ? " active" : "")
            }
            onMouseEnter={handleItemHover}
          >
            {item.icon}
          </NavLink>
        ))}
      </nav>

      {/* <div className="sidebar-footer">
        <LogOut size={20} />
      </div> */}
    </aside>
  );
};

export default SideBar;
