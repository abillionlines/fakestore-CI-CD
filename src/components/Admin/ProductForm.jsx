/*
ProductForm
- Controlled form for creating or updating a product in Firestore.
- When `product` prop is provided, pre-fills fields for editing and calls `updateProduct()`.
- When no `product` is provided, creates a new document via `createProduct()`.
- Calls `onSaved()` on success so ProductAdmin can refresh the product list.
*/
import React, { useEffect, useState } from "react";
import { createProduct, updateProduct } from "../../api/products";

const ProductForm = ({ product, onSaved, onCancel }) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (product) {
      setTitle(product.title || "");
      setPrice(product.price || 0);
      setDescription(product.description || "");
      setCategory(product.category || "");
      setImage(product.image || "");
    } else {
      setTitle("");
      setPrice(0);
      setDescription("");
      setCategory("");
      setImage("");
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title,
      price: Number(price),
      description,
      category,
      image,
    };
    try {
      if (product && product.id) {
        await updateProduct(product.id, payload);
      } else {
        await createProduct(payload);
      }
      onSaved?.();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to save product");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-sm">
      <div className="grid grid-cols-1 gap-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="p-2 border rounded"
        />
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          type="number"
          className="p-2 border rounded"
        />
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className="p-2 border rounded"
        />
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Image URL"
          className="p-2 border rounded"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="p-2 border rounded"
        />
        <div className="flex gap-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded border"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductForm;
