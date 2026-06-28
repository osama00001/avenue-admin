import React, { useCallback, useEffect, useState } from "react";
import { Table, Form } from "react-bootstrap";
import Link from "next/link";
import { toast } from "react-toastify";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";
import {
  fetchAdminOrders,
  formatDate,
  formatMoney,
  getOrderCustomerName,
  getOrderProductsSummary,
  getOrderStatusBadge,
  getPaymentStatusBadge,
  ORDER_STATUS_OPTIONS,
  updateAdminOrderStatus,
} from "../../lib/avenueClient";

const PAGE_SIZE = 10;

const OrderListTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAdminOrders({
        page: currentPage,
        limit: PAGE_SIZE,
        search,
      });
      setOrders(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message || "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const updated = await updateAdminOrderStatus({ id: orderId, status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, ...updated } : o))
      );
      toast.success("Order status updated — customer will see this in Track My Order");
    } catch (err) {
      toast.error(err.message || "Failed to update status");
      loadOrders();
    } finally {
      setUpdatingId(null);
    }
  };

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearch(searchInput.trim());
  };

  const startIndex = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(currentPage * PAGE_SIZE, total);

  return (
    <>
      <form className="row g-2 mb-3" onSubmit={handleSearchSubmit}>
        <div className="col-auto flex-grow-1">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search by order number or customer email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div className="col-auto">
          <button type="submit" className="btn btn-sm btn-primary">
            Search
          </button>
        </div>
      </form>

      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {!loading && error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{error}</span>
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={loadOrders}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="text-center py-4 text-muted">No orders found.</div>
      )}

      {!loading && !error && orders.length > 0 && (
        <>
          <OverlayScrollbarsComponent>
            <Table
              className="table table-dashed table-hover digi-dataTable all-product-table table-striped"
              id="orderListTable"
            >
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th style={{ minWidth: 180 }}>Order Status</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <Link href={`/order/${order._id}`} className="fw-semibold">
                        {order.orderNumber || order._id}
                      </Link>
                    </td>
                    <td>{getOrderCustomerName(order)}</td>
                    <td>
                      <Form.Select
                        size="sm"
                        value={order.status || "placed"}
                        disabled={updatingId === order._id}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="form-control form-control-sm"
                        style={{ minWidth: 160 }}
                      >
                        {ORDER_STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </Form.Select>
                    </td>
                    <td>{getOrderProductsSummary(order)}</td>
                    <td>{formatMoney(order.total, "GBP")}</td>
                    <td>
                      <span className="text-capitalize">{order.payment?.method || "—"}</span>
                      {order.payment?.status && (
                        <span className={`badge ms-1 ${getPaymentStatusBadge(order.payment.status)}`}>
                          {order.payment.status}
                        </span>
                      )}
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>
                      <Link href={`/order/${order._id}`} className="btn btn-sm btn-outline-primary">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </OverlayScrollbarsComponent>
          <PaginationSection
            currentPage={currentPage}
            totalPages={totalPages}
            paginate={paginate}
            startIndex={startIndex}
            endIndex={endIndex}
            total={total}
          />
        </>
      )}
    </>
  );
};

export default OrderListTable;
