import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "../../api/orders";

const OrderDetail = ({ orderId }) => {
  const { data: order, isLoading, isError } = useQuery(
    ["order", orderId],
    () => getOrderById(orderId),
    { enabled: !!orderId },
  );

  if (!orderId) return null;
  if (isLoading) return <div className="p-4">Loading order...</div>;
  if (isError || !order) return <div className="p-4 text-red-500">Failed to load order.</div>;

  return (
    <div className="mt-4 bg-white p-4 rounded shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <div className="font-semibold">Order ID: {order.id}</div>
        <div className="text-sm text-gray-500">
          {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : String(order.createdAt)}
        </div>
      </div>

      <div className="space-y-3">
        {order.items?.map((it) => (
          <div key={it.id} className="flex justify-between items-center border-b pb-2">
            <div>
              <div className="font-medium">{it.title}</div>
              <div className="text-sm text-gray-500">Qty: {it.quantity}</div>
            </div>
            <div className="font-semibold">${(it.price * it.quantity).toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <div className="text-xl font-bold">Total: ${order.totalPrice?.toFixed?.(2) || "-"}</div>
      </div>
    </div>
  );
};

export default OrderDetail;
