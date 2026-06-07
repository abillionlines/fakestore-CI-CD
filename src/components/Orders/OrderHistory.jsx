/*
OrderHistory
- Displays a list of past orders for the currently signed-in user.
- Fetches orders from the Firestore `orders` collection filtered by `userId` via React Query.
- Requires authentication; shows a login prompt if no user is present.
- Clicking an order row opens OrderDetail for full product breakdown.
*/
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getUserOrders } from "../../api/orders";
import OrderDetail from "./OrderDetail";

const OrderHistory = () => {
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", user?.uid],
    enabled: !!user,
    queryFn: () => getUserOrders(user.uid),
  });

  if (!user) return <p className="p-6">Please log in to see your orders.</p>;
  if (isLoading) return <p className="p-6">Loading orders...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Order History</h2>
      <div className="space-y-4">
        {orders?.map((o) => (
          <div key={o.id} className="bg-white p-4 rounded shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">Order: {o.id}</div>
                <div className="text-sm text-gray-500">
                  {new Date(
                    o.createdAt?.toDate?.() || o.createdAt || 0,
                  ).toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold">
                  ${o.totalPrice?.toFixed?.(2) || "-"}
                </div>
                <button
                  onClick={() =>
                    setSelectedOrder(selectedOrder === o.id ? null : o.id)
                  }
                  className="mt-2 text-sm text-blue-600"
                >
                  {selectedOrder === o.id ? "Hide details" : "View details"}
                </button>
              </div>
            </div>

            {selectedOrder === o.id && (
              <div className="mt-3">
                <OrderDetail orderId={o.id} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
