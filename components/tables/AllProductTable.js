import React, { useCallback, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import PaginationSection from "./PaginationSection";
import {
  fetchAdminProducts,
  formatDate,
  getBookPrice,
  getBookSku,
  getBookTitle,
} from "../../lib/avenueClient";

const PAGE_SIZE = 10;

const AllProductTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [books, setBooks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isEstimated, setIsEstimated] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAdminProducts({
        page: currentPage,
        limit: PAGE_SIZE,
        search,
      });
      setBooks(data.data || []);
      setHasMore(Boolean(data.hasMore));
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
      setIsEstimated(Boolean(data.isEstimated));
    } catch (err) {
      setError(err.message || "Failed to load products");
      setBooks([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setSearch(searchInput.trim());
  };

  const startIndex = books.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex = (currentPage - 1) * PAGE_SIZE + books.length;

  return (
    <>
      <form className="row g-2 mb-3" onSubmit={handleSearchSubmit}>
        <div className="col-auto flex-grow-1">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search by title or SKU..."
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
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={loadBooks}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && books.length === 0 && (
        <div className="text-center py-4 text-muted">No products found.</div>
      )}

      {!loading && !error && books.length > 0 && (
        <>
          <OverlayScrollbarsComponent>
            <Table
              className="table table-dashed table-hover digi-dataTable all-product-table table-striped"
              id="allProductTable"
            >
              <thead>
                <tr>
                  <th className="no-sort">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="markAllProduct"
                        readOnly
                      />
                    </div>
                  </th>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Availability</th>
                  <th>Price</th>
                  <th>Published</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book._id}>
                    <td>
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" readOnly />
                      </div>
                    </td>
                    <td>
                      <div className="table-product-card">
                        <div className="part-img">
                          {book.coverImage ? (
                            <img
                              src={book.coverImage}
                              alt={getBookTitle(book)}
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <div className="bg-light text-muted small p-2">No cover</div>
                          )}
                        </div>
                        <div className="part-txt">
                          <span className="product-name">{getBookTitle(book)}</span>
                          <span className="product-category">
                            {book.type || book.descriptiveDetail?.productForm || "Book"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>{getBookSku(book)}</td>
                    <td>
                      <span className="badge bg-success">
                        {book.availabilityStatus || (book.isSellable ? "Available" : "—")}
                      </span>
                    </td>
                    <td>{getBookPrice(book)}</td>
                    <td>{formatDate(book.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </OverlayScrollbarsComponent>
          <PaginationSection
            currentPage={currentPage}
            totalPages={totalPages}
            hasMore={hasMore}
            paginate={paginate}
            startIndex={startIndex}
            endIndex={endIndex}
            total={total}
            isEstimated={isEstimated}
          />
        </>
      )}
    </>
  );
};

export default AllProductTable;
