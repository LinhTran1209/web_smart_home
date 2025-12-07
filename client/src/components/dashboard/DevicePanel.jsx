import "../../assets/styles/devicepanel.css";
import iconFan1 from "../../assets/icons/fan1.svg?react";
import iconFan2 from "../../assets/icons/fan2.svg";
import iconFan3 from "../../assets/icons/fan3.svg";

import iconLight from "../../assets/icons/light.svg";

const DevicePanel = () => {
  return (
    <div className="device-panel">
      <div className="section-header">
        <h3>Quạt phòng ngủ</h3>
        <div className="toggle-inline">
          <span>ON</span>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider" />
          </label>
        </div>
      </div>

      <div className="device-body">
        {/* display for fan */}
        <div className="content-fans">
          <button className="btn-fan">
            <img src={iconFan1} alt="" className="fan-icon" />
            <span>Low</span>
          </button>
          <button className="btn-fan">
            <img src={iconFan2} alt="" className="fan-icon" />
            <span>Medium</span>
          </button>
          <button className="btn-fan">
            <img src={iconFan3} alt="" className="fan-icon" />
            <span>High</span>
          </button>
        </div>

        {/* display cho đèn */}
        <div className="content-light">
          <img src={iconLight} alt="" className="light-icon" />
        </div>

        {/* display cho ac điều hòa */}
        <div className="content-ac">
          <button className="round-btn">−</button>

          <div className="temp-circle-wrapper">
            <div className="temp-circle-outer">
              <div className="temp-circle-inner">
                <span className="temp-value">25°C</span>
                {/* <span className="temp-unit">Celsius</span> */}
              </div>
            </div>
          </div>

          <button className="round-btn">+</button>
        </div>
      </div>

      <div className="device-footer">
        {/* <span>05°C</span>
        <span>25°C</span> */}
      </div>
    </div>
  );
};

export default DevicePanel;
