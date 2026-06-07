import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../store/cartSlice";

/**
 * Renders a component wrapped in a Redux Provider.
 * Accepts optional preloadedState to seed the store.
 * Returns all RTL queries plus the store instance.
 */
export function renderWithStore(ui, preloadedState = {}) {
  const store = configureStore({
    reducer: { cart: cartReducer },
    preloadedState,
  });

  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  };
}
