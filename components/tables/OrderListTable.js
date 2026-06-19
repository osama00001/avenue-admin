import React, { useCallback, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Link from "next/link";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";
import {
  fetchAdminOrders,
  formatDate,
  formatMoney,
  getOrderCustomerName,
  getOrderProductsSummary,
  getOrderStatusBadge,
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
                  <th className="no-sort">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="markAllOrders"
                        readOnly
                      />
                    </div>
                  </th>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Payment Method</th>
                  <th>Delivery Status</th>
                  <th>Order Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" readOnly />
                      </div>
                    </td>
                    <td>
                      <Link href="#">{order.orderNumber || order._id}</Link>
                    </td>
                    <td>{getOrderCustomerName(order)}</td>
                    <td>
                      <span className="text-capitalize">{order.status}</span>
                    </td>
                    <td>{getOrderProductsSummary(order)}</td>
                    <td>{formatMoney(order.total, "GBP")}</td>
                    <td>{order.payment?.method || "—"}</td>
                    <td>
                      <span className={`badge ${getOrderStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
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
