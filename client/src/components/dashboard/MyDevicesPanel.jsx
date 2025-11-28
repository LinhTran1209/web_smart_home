const MyDevicesPanel = () => {
  return (
    <>
      <div className="section-header">
        <h3>My Devices</h3>
        <span className="muted">ON ▾</span>
      </div>

      <div className="mydevices-grid">
        <div className="small-device-card sd-purple">
          <div className="device-status-row">
            <span className="device-status">ON</span>
            <label className="switch tiny">
              <input type="checkbox" defaultChecked />
              <span className="slider" />
            </label>
          </div>
          <div className="device-icon">🧊</div>
          <div className="device-name">Refrigerator</div>
        </div>

        <div className="small-device-card sd-orange">
          <div className="device-status-row">
            <span className="device-status">ON</span>
            <label className="switch tiny">
              <input type="checkbox" />
              <span className="slider" />
            </label>
          </div>
          <div className="device-icon">🔥</div>
          <div className="device-name">Heater</div>
        </div>

        <div className="small-device-card sd-brown">
          <div className="device-status-row">
            <span className="device-status">ON</span>
            <label className="switch tiny">
              <input type="checkbox" />
              <span className="slider" />
            </label>
          </div>
          <div className="device-icon">🎵</div>
          <div className="device-name">Music System</div>
        </div>

        <div className="small-device-card sd-blue">
          <div className="device-status-row">
            <span className="device-status">ON</span>
            <label className="switch tiny">
              <input type="checkbox" defaultChecked />
              <span className="slider" />
            </label>
          </div>
          <div className="device-icon">💡</div>
          <div className="device-name">Lamps</div>
        </div>
      </div>
    </>
  );
};

export default MyDevicesPanel;
