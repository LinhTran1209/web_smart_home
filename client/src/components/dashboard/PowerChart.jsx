const PowerChart = () => {
  return (
    <div className="power-panel">
      <div className="section-header">
        <h3>Power Consumed</h3>
        <div className="section-header-right">
          <span className="muted">Month ▾</span>
        </div>
      </div>

      <div className="power-legend">
        <span className="dot dot-orange"></span>
        <span>Electricity Consumed</span>
        <span className="spacer" />
        <span className="muted">73% Spending</span>
      </div>

      <div className="power-chart-placeholder">
        <div className="chart-line" />
      </div>

      <div className="power-footer">
        <span>Jan</span>
        <span>Feb</span>
        <span>Mar</span>
        <span>Apr</span>
        <span>May</span>
      </div>
    </div>
  );
};

export default PowerChart;
