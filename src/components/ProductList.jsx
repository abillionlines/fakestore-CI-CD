/*
ProductList
- Fetches product categories and product lists using React Query.
- Manages local `selectedCategory` state to filter products.
- Renders loading / error states and maps products to `ProductCard`.
*/

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts, fetchCategories } from "../api/products";
import ProductCard from "./ProductCard";
import { Filter, Loader2 } from "lucide-react";

const ProductList = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const {
    data: products,
    isLoading: isProductsLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["products", selectedCategory],
    queryFn: () => fetchProducts(selectedCategory),
  });

  if (isProductsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 font-medium">
          Error loading products. Please try again later.
        </p>
        <p className="text-red-400 text-sm mt-2 font-mono">
          {error?.message || String(error)}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
        <div className="flex items-center gap-3">
          <label
            htmlFor="category"
            className="flex items-center text-gray-700 font-medium whitespace-nowrap"
          >
            <Filter className="w-5 h-5 mr-2" />
            Category:
          </label>
          <select
            id="category"
            className="block w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={isCategoriesLoading}
          >
            <option value="all">All Products</option>
            {categories?.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products?.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">
            No products found in this category.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
