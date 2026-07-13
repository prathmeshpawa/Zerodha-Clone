import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:3002/orders");
        if (!response.ok) {
          throw new Error("Could not fetch orders");
        }
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="orders">
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders">
        <p>Error loading orders: {error}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders">
        <div className="no-orders">
          <p>You haven't placed any orders today</p>
          <Link to="/" className="btn btn-blue">
            Get started
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders">
      <div className="orders-table">
        <div className="orders-row orders-header">
          <span>Instrument</span>
          <span>Qty</span>
          <span>Price</span>
          <span>Mode</span>
        </div>
        {orders.map((order) => (
          <div key={order._id} className="orders-row">
            <span>{order.name}</span>
            <span>{order.qty}</span>
            <span>{order.price}</span>
            <span>{order.mode}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
