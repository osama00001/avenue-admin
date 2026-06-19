import React from "react";
import { formatMoney } from "@/lib/avenueClient";

function getInitials(name, email) {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return "";
}

function CustomerAvatar({ name, email }) {
  const initials = getInitials(name, email);

  return (
    <div
      className="d-flex align-items-center justify-content-center w-100 h-100"
      style={{
        background: "hsl(205deg 100% 52% / 18%)",
        color: "hsl(205deg 100% 68%)",
        fontWeight: 600,
        fontSize: "1rem",
        letterSpacing: "0.02em",
      }}
      aria-hidden="true"
    >
      {initials || <i className="fa-light fa-user" style={{ fontSize: "1.25rem" }} />}
    </div>
  );
}

const NewCustomer = ({ customers = [], loading }) => {
  return (
    <div className="col-xxl-4 col-md-6">
      <div className="panel">
        <div className="panel-header">
          <h5>New Customers</h5>
        </div>
        <div className="panel-body">
          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {!loading && customers.length === 0 && (
            <div className="text-center py-4 text-muted">No customers yet.</div>
          )}

          {!loading && customers.length > 0 && (
            <table className="table table-borderless new-customer-table mb-0">
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="align-middle">
                    <td className="ps-0">
                      <div className="new-customer">
                        <div className="part-img rounded-circle">
                          <CustomerAvatar name={customer.name} email={customer.email} />
                        </div>
                        <div className="part-txt">
                          <p className="customer-name mb-1">{customer.name}</p>
                          <span className="text-muted">
                            @{customer.email?.split("@")[0] || "customer"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="text-nowrap text-muted">
                      {customer.orderCount} Order{customer.orderCount === 1 ? "" : "s"}
                    </td>
                    <td className="text-nowrap pe-0 fw-medium">{formatMoney(customer.spent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewCustomer;
