import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../store/cartSlice";
import ProductCard from "../components/ProductCard";
import Cart from "../components/Cart";

const mockProduct = {
  id: 99,
  title: "Integration Test Sneakers",
  price: 49.99,
  category: "footwear",
  description: "Comfortable running shoes.",
  image: "https://via.placeholder.com/200",
  rating: { rate: 4.2, count: 60 },
};

describe("Cart integration – adding a product", () => {
  it("updates the cart when a product is added via ProductCard", async () => {
    const user = userEvent.setup();

    // Shared store so both components read/write the same cart state
    const store = configureStore({
      reducer: { cart: cartReducer },
      preloadedState: { cart: { items: [] } },
    });

    render(
      <Provider store={store}>
        <ProductCard product={mockProduct} />
        <Cart />
      </Provider>,
    );

    // Cart is empty before interacting
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();

    // Simulate user clicking Add on the ProductCard
    const addButton = screen.getByRole("button", { name: /add/i });
    await user.click(addButton);

    // Empty-state message should be gone
    expect(screen.queryByText(/your cart is empty/i)).not.toBeInTheDocument();

    // Product title now appears in both ProductCard and the Cart item list
    const titleElements = screen.getAllByText("Integration Test Sneakers");
    expect(titleElements.length).toBeGreaterThanOrEqual(2);

    // Quantity in the Redux store should be 1 after a single click
    expect(store.getState().cart.items[0].quantity).toBe(1);
  });
});
