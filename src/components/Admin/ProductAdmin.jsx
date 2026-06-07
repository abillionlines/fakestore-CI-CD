/*
ProductAdmin
- Admin-only panel for managing the product catalogue stored in Firestore.
- Lists all products from the `products` collection via React Query.
- Allows admins to create new products (via ProductForm), edit existing ones, or delete them.
- Visible only when the logged-in user matches VITE_ADMIN_EMAIL or VITE_ADMIN_UID in .env.local.
*/
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getProducts, deleteProduct } from "../../api/products";
import ProductForm from "./ProductForm";

const ProductAdmin = () => {
  const queryClient = useQueryClient();
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", "all"],
    queryFn: () => getProducts(),
  });
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      queryClient.invalidateQueries(["products"]);
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  const onSaved = () => {
    setEditing(null);
    setCreating(false);
    queryClient.invalidateQueries(["products"]);
  };

  if (isLoading) return <div className="p-4">Loading products...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product Admin</h2>
        <div>
          <button
            onClick={() => setCreating(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create Product
          </button>
        </div>
      </div>

      {creating && (
        <div className="mb-6">
          <ProductForm onSaved={onSaved} onCancel={() => setCreating(false)} />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded shadow-sm">
            <div className="font-semibold mb-2">{p.title}</div>
            <div className="text-sm text-gray-500 mb-3">{p.category}</div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(p)}
                className="px-3 py-1 border rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="px-3 py-1 border rounded text-red-600"
              >
                Delete
              </button>
            </div>

            {editing && editing.id === p.id && (
              <div className="mt-3">
                <ProductForm
                  product={editing}
                  onSaved={onSaved}
                  onCancel={() => setEditing(null)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductAdmin;
