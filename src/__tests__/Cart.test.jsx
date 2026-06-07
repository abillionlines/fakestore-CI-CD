import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import Cart from "../components/Cart";
import { renderWithStore } from "./testUtils";

describe("Cart", () => {
  it("renders an empty-state message when the cart has no items", () => {
    renderWithStore(<Cart />, { cart: { items: [] } });

    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  it("renders item details and correct quantity when the cart has items", () => {
    const preloadedState = {
      cart: {
        items: [
          {
            id: 10,
            title: "Classic Leather Jacket",
            price: 89.99,
            quantity: 2,
            category: "clothing",
            image: "",
          },
        ],
      },
    };

    renderWithStore(<Cart />, preloadedState);

    expect(screen.getByText("Classic Leather Jacket")).toBeInTheDocument();
    expect(screen.getByText("$89.99")).toBeInTheDocument();
    // quantity is displayed in the stepper
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
