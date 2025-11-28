const HomeDevices = () => {
  return (
    <>
      <div className="section-header">
        <h3>Scarlett&apos;s Home</h3>
        <div className="section-header-right">
          <span>35%</span>
          <span>15A�C</span>
          <span>Living Room �-_</span>
        </div>
      </div>

      <div className="devices-row">
        <div className="device-card device-card--primary">
          <div className="device-status">ON</div>
          <div className="device-icon">dYS</div>
          <div className="device-name">Refrigerator</div>
        </div>

        <div className="device-card device-card--primary">
          <div className="device-status">ON</div>
          <div className="device-icon">dYO�</div>
          <div className="device-name">Temperature</div>
        </div>

        <div className="device-card device-card--neutral">
          <div className="device-status-row">
            <span>OFF</span>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider" />
            </label>
          </div>
          <div className="device-icon">dYO�</div>
          <div className="device-name">Air Conditioner</div>
        </div>

        <div className="device-card device-card--neutral">
          <div className="device-status-row">
            <span>OFF</span>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider" />
            </label>
          </div>
          <div className="device-icon">dY'�</div>
          <div className="device-name">Lights</div>
        </div>
      </div>
    </>
  );
};

export default HomeDevices;
