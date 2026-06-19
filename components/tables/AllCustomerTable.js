import React, { useCallback, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Link from "next/link";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";
import {
  fetchAdminUsers,
  formatDate,
  getCustomerName,
} from "../../lib/avenueClient";

const PAGE_SIZE = 10;

const AllCustomerTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAdminUsers({
        page: currentPage,
        limit: PAGE_SIZE,
        search,
      });
      setUsers(data.list || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message || "Failed to load customers");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

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
            placeholder="Search by name or email..."
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
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={loadUsers}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && users.length === 0 && (
        <div className="text-center py-4 text-muted">No customers found.</div>
      )}

      {!loading && !error && users.length > 0 && (
        <>
          <OverlayScrollbarsComponent>
            <Table
              className="table table-dashed table-hover digi-dataTable all-product-table table-striped"
              id="allCustomerTable"
            >
              <thead>
                <tr>
                  <th className="no-sort">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="markAllCustomer"
                        readOnly
                      />
                    </div>
                  </th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Date Registered</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" readOnly />
                      </div>
                    </td>
                    <td>
                      <Link href="#">{getCustomerName(user)}</Link>
                    </td>
                    <td>
                      <Link href="#">{user.email}</Link>
                    </td>
                    <td>
                      <span
                        className={`badge ${user.status ? "bg-success" : "bg-secondary"}`}
                      >
                        {user.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
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

export default AllCustomerTable;
