import Link from "next/link";
import React from "react";
import CountUp from "react-countup";
import { formatMoney } from "@/lib/avenueClient";

const DashboardCards = ({ summary, loading }) => {
  const cards = [
    {
      value: summary?.totalRevenue || 0,
      isMoney: true,
      label: "Total Revenue",
      sub: "Paid orders only",
      href: "/order",
      icon: "fa-dollar-sign",
    },
    {
      value: summary?.totalOrders || 0,
      isMoney: false,
      label: "Total Orders",
      sub: "View all orders",
      href: "/order",
      icon: "fa-bag-shopping",
    },
    {
      value: summary?.totalCustomers || 0,
      isMoney: false,
      label: "Total Customers",
      sub: "View customers",
      href: "/allCustomer",
      icon: "fa-user",
    },
    {
      value: summary?.monthRevenue || 0,
      isMoney: true,
      label: "Revenue This Month",
      sub: "Paid orders",
      href: "/order",
      icon: "fa-chart-line",
    },
  ];

  return (
    <div className="row mb-30">
      {cards.map((card) => (
        <div className="col-lg-3 col-6 col-xs-12" key={card.label}>
          <div className="dashboard-top-box rounded-bottom panel-bg">
            <div className="left">
              <h3>
                {loading ? (
                  "—"
                ) : card.isMoney ? (
                  formatMoney(card.value)
                ) : (
                  <CountUp end={card.value} duration={1} separator="," />
                )}
              </h3>
              <p>{card.label}</p>
              <Link href={card.href}>{card.sub}</Link>
            </div>
            <div className="right">
              <div className="part-icon rounded">
                <span>
                  <i className={`fa-light ${card.icon}`}></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
