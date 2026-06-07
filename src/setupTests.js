import "@testing-library/jest-dom";
import { beforeEach } from "vitest";

// Clear sessionStorage before each test so cart state doesn't bleed between tests
beforeEach(() => {
  sessionStorage.clear();
});
