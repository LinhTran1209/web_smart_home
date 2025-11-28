import { MapPin, Shield, Users } from "lucide-react";
import React, { useEffect, useState} from "react";

const TopBar = () => {
  const account = JSON.parse(localStorage.getItem("account")) || {};


  return (
    <div className="topbar">
      <div className="search-wrapper">
        <input
          className="search-input"
          placeholder="Search"
          type="text"
        />
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
          
          <div className="avatar">{account.email?account.email[0].toUpperCase(): "NaN"}</div>
          <div className="profile-info">
            <span className="profile-name">{account.full_name?? "NaN"}</span>
            <span className="profile-role">{account.role?? "NaN"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
