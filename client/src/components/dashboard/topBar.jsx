import { MapPin, Shield, Users, User, LogOut } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/styles/topbar.css";
import { Search } from "lucide-react";
import api from "../../utils/axios.js";
import { toast } from "sonner";

const TopBar = () => {
  const account = JSON.parse(localStorage.getItem("account")) || {};
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await api.post("/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("account");

      toast.success(res.message || "Logout successfully!");
      setTimeout(() => navigate('/'), 600)

    } catch (error) {
      console.error("Logout error", error);
      toast.error(err?.response?.data?.message || "Logout failed.");
    }
  }

  return (
    <div className="topbar">
      <div className="search-wrapper">
        <input className="search-input" placeholder="Search" type="text" />
        <Search size={16} className="search-icon" />
      </div>

      <div className="topbar-actions">
        <button className="icon-btn" title="Security">
          <Shield size={18} />
        </button>
        <button className="icon-btn" title="Members">
          <Users size={18} />
        </button>
        <button className="icon-btn" title="Location">
          <MapPin size={18} />
        </button>

        <div className="profile">
          <div className="profile-info">
            <span className="profile-name">{account.full_name ?? "NaN"}</span>
            <span className="profile-role">{account.role ?? "NaN"}</span>
          </div>
          <div className="avatar">
            {account.email ? account.email[0].toUpperCase() : "NaN"}
          </div>

          <div className="profile-dropdown hover-animate">
            <div className="dropdown-item" onClick={() => navigate('/profile')}>
              <span>Profile</span>
              <User size={16} />
            </div>

            <div className="dropdown-item" onClick={handleLogout}>
              <span>Logout</span>
              <LogOut size={16} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
