import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductCard from "../components/ProductCard";
import { renderWithStore } from "./testUtils";

const mockProduct = {
  id: 1,
  title: "Test Wireless Headphones",
  price: 29.99,
  category: "electronics",
  description: "Great sound quality for everyday use.",
  image: "https://via.placeholder.com/200",
  rating: { rate: 4.5, count: 120 },
};

describe("ProductCard", () => {
  it("renders product title, category, and price", () => {
    renderWithStore(<ProductCard product={mockProduct} />);

    expect(screen.getByText("Test Wireless Headphones")).toBeInTheDocument();
    expect(screen.getByText("electronics")).toBeInTheDocument();
    expect(screen.getByText("$29.99")).toBeInTheDocument();
  });

  it("adds the product to the Redux cart when Add button is clicked", async () => {
    const user = userEvent.setup();
    const { store } = renderWithStore(<ProductCard product={mockProduct} />);

    const addButton = screen.getByRole("button", { name: /add/i });
    await user.click(addButton);

    const cartItems = store.getState().cart.items;
    expect(cartItems).toHaveLength(1);
    expect(cartItems[0].id).toBe(1);
    expect(cartItems[0].quantity).toBe(1);
  });
});
