import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Form } from "react-bootstrap";
import Link from "next/link";
import { toast } from "react-toastify";
import Head from "next/head";
import Footer from "@/components/footer/Footer";
import {
  fetchAdminOrder,
  formatDate,
  formatMoney,
  getOrderCustomerName,
  getOrderStatusBadge,
  getOrderStatusLabel,
  ORDER_STATUS_OPTIONS,
  updateAdminOrderStatus,
} from "@/lib/avenueClient";

const OrderDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [order, setOrder] = useState(null);
  const [statusDraft, setStatusDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchAdminOrder(id);
        setOrder(data);
        setStatusDraft(data.status || "placed");
      } catch (err) {
        setError(err.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleSaveStatus = async () => {
    if (!order || statusDraft === order.status) return;
    setSaving(true);
    try {
      const updated = await updateAdminOrderStatus({ id: order._id, status: statusDraft });
      setOrder(updated);
      setStatusDraft(updated.status);
      toast.success("Status saved — customer Track My Order will show this step");
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Head>
        <title>Digiboard - Order Detail</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/favicon.png" />
      </Head>

      <div className="main-content">
        <div className="row g-4">
          <div className="col-12">
            <div className="panel">
              <div className="panel-header d-flex justify-content-between align-items-center flex-wrap gap-2">
                <h5 className="mb-0">
                  {order ? `Order ${order.orderNumber}` : "Order Detail"}
                </h5>
                <Link href="/order" className="btn btn-sm btn-outline-secondary">
                  ← Back to Orders
                </Link>
              </div>

              <div className="panel-body">
                {loading && (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status" />
                  </div>
                )}

                {!loading && error && (
                  <div className="alert alert-danger">{error}</div>
                )}

                {!loading && order && (
                  <div className="row g-4">
                    <div className="col-lg-8">
                      <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body">
                          <h6 className="text-muted text-uppercase small mb-3">Items</h6>
                          <div className="table-responsive">
                            <table className="table table-sm">
                              <thead>
                                <tr>
                                  <th>Title</th>
                                  <th>Type</th>
                                  <th className="text-end">Qty</th>
                                  <th className="text-end">Price</th>
                                  <th className="text-end">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(order.items || []).map((item, i) => (
                                  <tr key={i}>
                                    <td>{item.title}</td>
                                    <td className="text-capitalize">{item.type}</td>
                                    <td className="text-end">{item.quantity}</td>
                                    <td className="text-end">{formatMoney(item.price)}</td>
                                    <td className="text-end fw-semibold">
                                      {formatMoney(item.price * item.quantity)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      <div className="card border-0 shadow-sm">
                        <div className="card-body">
                          <h6 className="text-muted text-uppercase small mb-3">Shipping Address</h6>
                          <p className="mb-1 fw-semibold">{order.shippingAddress?.name}</p>
                          <p className="mb-1">{order.shippingAddress?.line1}</p>
                          {order.shippingAddress?.line2 && (
                            <p className="mb-1">{order.shippingAddress.line2}</p>
                          )}
                          <p className="mb-1">
                            {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                            {order.shippingAddress?.postalCode}
                          </p>
                          <p className="mb-1">{order.shippingAddress?.country}</p>
                          <p className="mb-0 text-muted">{order.shippingAddress?.phone}</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-4">
                      <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body">
                          <h6 className="text-muted text-uppercase small mb-3">
                            Update Order Status
                          </h6>
                          <p className="small text-muted mb-3">
                            Customer sees this in <strong>Track My Order</strong> on the website.
                          </p>
                          <div className="mb-2">
                            <span className="text-muted small">Current:</span>{" "}
                            <span className={`badge ${getOrderStatusBadge(order.status)}`}>
                              {getOrderStatusLabel(order.status)}
                            </span>
                          </div>
                          <Form.Select
                            value={statusDraft}
                            onChange={(e) => setStatusDraft(e.target.value)}
                            className="mb-3"
                          >
                            {ORDER_STATUS_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </Form.Select>
                          <button
                            type="button"
                            className="btn btn-primary w-100"
                            disabled={saving || statusDraft === order.status}
                            onClick={handleSaveStatus}
                          >
                            {saving ? "Saving..." : "Save Status"}
                          </button>
                        </div>
                      </div>

                      <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body">
                          <h6 className="text-muted text-uppercase small mb-3">Customer</h6>
                          <p className="mb-1 fw-semibold">{getOrderCustomerName(order)}</p>
                          <p className="mb-0 text-muted">{order.user?.email}</p>
                        </div>
                      </div>

                      <div className="card border-0 shadow-sm mb-4">
                        <div className="card-body">
                          <h6 className="text-muted text-uppercase small mb-3">Payment</h6>
                          <p className="mb-1">
                            Method: <strong>{order.payment?.method}</strong>
                          </p>
                          <p className="mb-0">
                            Status:{" "}
                            <span className={`badge ${getOrderStatusBadge(order.payment?.status)}`}>
                              {order.payment?.status}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="card border-0 shadow-sm">
                        <div className="card-body">
                          <h6 className="text-muted text-uppercase small mb-3">Totals</h6>
                          <div className="d-flex justify-content-between mb-1">
                            <span>Subtotal</span>
                            <span>{formatMoney(order.subtotal)}</span>
                          </div>
                          <div className="d-flex justify-content-between mb-1">
                            <span>Shipping</span>
                            <span>{formatMoney(order.shippingCost)}</span>
                          </div>
                          <hr />
                          <div className="d-flex justify-content-between fw-bold">
                            <span>Total</span>
                            <span>{formatMoney(order.total)}</span>
                          </div>
                          <p className="small text-muted mt-3 mb-0">
                            Placed: {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default OrderDetailPage;
