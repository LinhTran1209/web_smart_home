const TemperaturePanel = () => {
  return (
    <div className="temperature-panel">
      <div className="section-header">
        <h3>Living Room Temperature</h3>
        <div className="toggle-inline">
          <span>ON</span>
          <label className="switch small">
            <input type="checkbox" defaultChecked />
            <span className="slider" />
          </label>
        </div>
      </div>

      <div className="temperature-body">
        <button className="round-btn">−</button>

        <div className="temp-circle-wrapper">
          <div className="temp-circle-outer">
            <div className="temp-circle-inner">
              <span className="temp-value">25°C</span>
              <span className="temp-unit">Celsius</span>
            </div>
          </div>
        </div>

        <button className="round-btn">+</button>
      </div>

      <div className="temperature-footer">
        <span>05°C</span>
        <span>25°C</span>
      </div>
    </div>
  );
};

export default TemperaturePanel;
