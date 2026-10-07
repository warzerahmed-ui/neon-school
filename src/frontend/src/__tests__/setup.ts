import "@testing-library/jest-dom/vitest";
import { configure } from "@testing-library/react";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Generated components expose `data-ocid`; use it as the test-id attribute so
// `getByTestId` reads the app's own stable hooks rather than CSS classes.
configure({ testIdAttribute: "data-ocid" });

afterEach(() => {
  cleanup();
});
