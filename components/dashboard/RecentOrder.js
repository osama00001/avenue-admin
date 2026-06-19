import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import React from "react";
import Link from "next/link";
import {
  formatDate,
  formatMoney,
  getOrderCustomerName,
  getOrderStatusBadge,
  getPaymentMethodLabel,
  getPaymentStatusBadge,
} from "@/lib/avenueClient";

const RecentOrder = ({ orders = [], loading }) => {
  return (
    <div className="col-xxl-8">
      <div className="panel recent-order">
        <div className="panel-header">
          <h5>Recent Orders</h5>
          <Link href="/order" className="btn btn-sm btn-outline-primary">
            View all
          </Link>
        </div>
        <div className="panel-body">
          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {!loading && orders.length === 0 && (
            <div className="text-center py-4 text-muted">No orders yet.</div>
          )}

          {!loading && orders.length > 0 && (
            <OverlayScrollbarsComponent>
              <table className="table table-dashed recent-order-table dataTable no-footer">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Order Date</th>
                    <th>Payment Method</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order.orderNumber || "—"}</td>
                      <td>{getOrderCustomerName(order)}</td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>{getPaymentMethodLabel(order.payment?.method)}</td>
                      <td>{formatMoney(order.total)}</td>
                      <td>
                        <span className={`badge ${getOrderStatusBadge(order.status)}`}>
                          {order.status || "—"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${getPaymentStatusBadge(order.payment?.status)}`}
                        >
                          {order.payment?.status || "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </OverlayScrollbarsComponent>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentOrder;
