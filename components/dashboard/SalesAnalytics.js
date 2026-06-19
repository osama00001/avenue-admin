import React from "react";
import SalesChart from "../charts/SalesChart";

const SalesAnalytics = ({ chart = [], days = 7, onDaysChange, loading }) => {
  const ranges = [
    { label: "Week", value: 7 },
    { label: "Month", value: 30 },
    { label: "Year", value: 365 },
  ];

  return (
    <div className="col-xxl-8">
      <div className="panel chart-panel-1">
        <div className="panel-header">
          <h5>Sales Analytics</h5>
          <small className="text-muted">Revenue from paid orders</small>
          <div className="btn-box">
            {ranges.map((range) => (
              <button
                key={range.value}
                type="button"
                className={`btn btn-sm ${days === range.value ? "btn-primary" : "btn-outline-primary"}`}
                onClick={() => onDaysChange(range.value)}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
        <div className="panel-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : chart.length === 0 ? (
            <div className="text-center py-5 text-muted">No order data for this period.</div>
          ) : (
            <div id="saleAnalytics" className="chart-dark">
              <SalesChart data={chart} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesAnalytics;
