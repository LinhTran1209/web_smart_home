import "../../assets/styles/devicepanel.css";

import { useEffect, useState } from "react";
import Icon from "@mdi/react";
import {
  mdiFanSpeed1,
  mdiFanSpeed2,
  mdiFanSpeed3,
  mdiLightbulbOutline,
  mdiSnowflake,
  mdiWhiteBalanceSunny,
  mdiWeatherWindy,
  mdiWaterOutline,
  mdiSyncCircle,
  mdiFanAuto,
  mdiWaves,
  mdiTimerOutline,
  mdiTimerOffOutline,
} from "@mdi/js";

const DevicePanel = ({ selectedDevice, onDeviceCommand }) => {
  const [fanLevel, setFanLevel] = useState("low");
  const [mode, setMode] = useState("cool");
  const [acFanSpeed, setAcFanSpeed] = useState("low");
  const [temp, setTemp] = useState(25);

  // reset UI khi đổi thiết bị
  useEffect(() => {
    setFanLevel("low");
    setMode("cool");
    setAcFanSpeed("low");
    setTemp(25);
  }, [selectedDevice?.device?.device_id]);

  if (!selectedDevice) {
    return (
      <div className="device-panel device-panel--empty">
        <span>Select a device to control.</span>
      </div>
    );
  }

  const { device, deviceState, controlType, isOn } = selectedDevice;
  const disabled = !isOn;
  const type = controlType || "fan";
  const title = device?.device_name || "Thiết bị";

  const MIN_TEMP = 16;
  const MAX_TEMP = 32;

  // tiến độ nhiệt độ 0 → 1
  const tempProgress = (temp - MIN_TEMP) / (MAX_TEMP - MIN_TEMP);
  const clampedProgress = Math.min(1, Math.max(0, tempProgress));
  // góc quét của vòng màu (0–360 độ)
  const tempAngle = 360 * clampedProgress;

  const sendCommand = (command) => {
    if (!onDeviceCommand) return;
    onDeviceCommand(device, command);
  };

  // các handler
  const handleFanLevelClick = (level) => {
    if (disabled) return;
    setFanLevel(level);
    sendCommand({ kind: "fan_speed", value: level });
  };

  const handleLightClick = () => {
    if (disabled) return;
    sendCommand({ kind: "light_tap" });
  };

  const handleTempChange = (delta) => {
    if (disabled) return;
    const next = Math.min(MAX_TEMP, Math.max(16, temp + delta));
    setTemp(next);
    sendCommand({ kind: "ac_temp", value: next });
  };

  const handleModeClick = (m) => {
    if (disabled) return;
    setMode(m);
    sendCommand({ kind: "ac_mode", value: m });
  };

  const handleAcFanSpeedClick = (level) => {
    if (disabled) return;
    setAcFanSpeed(level);
    sendCommand({ kind: "ac_fan_speed", value: level });
  };

  const handleExtraClick = (kind) => {
    if (disabled) return;
    sendCommand({ kind });
  };

  return (
    <div className="device-panel">
      <div className="section-header">
        <h3>{title}</h3>
        <div className="device-power-indicator">
          <span className={`power-dot ${isOn ? "on" : "off"}`}></span>
        </div>
      </div>

      <div
        className={
          disabled ? " device-panel--disabled device-body" : "device-body"
        }
      >
        {/* display cho quạt */}
        {type === "fan" && (
          <>
            <div className="content-fans">
              {[
                ["low", mdiFanSpeed1, "Low"],
                ["medium", mdiFanSpeed2, "Medium"],
                ["high", mdiFanSpeed3, "High"],
              ].map(([key, iconPath, label]) => (
                <button
                  key={key}
                  className={
                    "btn-fan" + (fanLevel === key ? " btn-fan--active" : "")
                  }
                  disabled={disabled}
                  onClick={() => handleFanLevelClick(key)}
                >
                  <Icon
                    path={iconPath}
                    size={1}
                    color={fanLevel === key ? "#FFFFFF" : "#262262"}
                  />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* display cho đèn */}
        {type === "led" && (
          <div
            className={`content-light ${isOn ? "light-on" : ""}`}
            onClick={handleLightClick}
          >
            <Icon
              path={mdiLightbulbOutline}
              size={3}
              color={isOn ? "#f6c453" : "#262262"}
            />
          </div>
        )}

        {/* display cho ac */}
        {type === "ac" && (
          <>
            <div className="ac-temp-control">
              <button
                className="round-btn"
                disabled={disabled}
                onClick={() => handleTempChange(-1)}
              >
                −
              </button>

              <div className="temp-circle-wrapper">
                <div
                  className="temp-circle-outer"
                  style={{
                    background: `conic-gradient(var(--dash-purple) 0deg ${tempAngle}deg, #e9e5ff ${tempAngle}deg 360deg)`,
                  }}
                >
                  <div className="temp-circle-inner">
                    <span className="temp-value">{temp}°C</span>
                  </div>
                </div>
              </div>

              <button
                className="round-btn"
                disabled={disabled}
                onClick={() => handleTempChange(1)}
              >
                +
              </button>
            </div>

            <div className="ac-section">
              <span className="ac-label">Mode</span>
              <div className="mode-ac">
                {[
                  ["cool", mdiSnowflake, "Cool"],
                  ["heat", mdiWhiteBalanceSunny, "Heat"],
                  ["fan", mdiWeatherWindy, "Fan"],
                  ["dry", mdiWaterOutline, "Dry"],
                  ["auto", mdiSyncCircle, "Auto"],
                ].map(([key, iconPath, label]) => (
                  <button
                    key={key}
                    className={
                      "mode-btn" + (mode === key ? " mode-btn--active" : "")
                    }
                    disabled={disabled}
                    onClick={() => handleModeClick(key)}
                  >
                    <Icon
                      path={iconPath}
                      size={1}
                      color={mode === key ? "#FFFFFF" : "#262262"}
                    />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="ac-section">
              <span className="ac-label">Fan speed</span>
              <div className="ac-fan-speed">
                {[
                  ["low", mdiFanSpeed1, "Low"],
                  ["medium", mdiFanSpeed2, "Medium"],
                  ["high", mdiFanSpeed3, "High"],
                  ["auto", mdiFanAuto, "Auto"],
                ].map(([key, iconPath, label]) => (
                  <button
                    key={key}
                    className={
                      "ac-fan-btn" +
                      (acFanSpeed === key ? " ac-fan-btn--active" : "")
                    }
                    disabled={disabled}
                    onClick={() => handleAcFanSpeedClick(key)}
                  >
                    <Icon
                      path={iconPath}
                      size={1}
                      color={acFanSpeed === key ? "#FFFFFF" : "#262262"}
                    />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="ac-extra-actions">
              <button
                className="ac-extra-card"
                disabled={disabled}
                onClick={() => handleExtraClick("ac_swing")}
              >
                <Icon path={mdiWaves} size={1.4} color="#262262" />
                <span>Swing</span>
              </button>

              <button
                className="ac-extra-card"
                disabled={disabled}
                onClick={() => handleExtraClick("ac_timer_on")}
              >
                <Icon path={mdiTimerOutline} size={1.4} color="#262262" />
                <span>Timer On</span>
              </button>

              <button
                className="ac-extra-card"
                disabled={disabled}
                onClick={() => handleExtraClick("ac_timer_off")}
              >
                <Icon path={mdiTimerOffOutline} size={1.4} color="#262262" />
                <span>Timer Off</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DevicePanel;
