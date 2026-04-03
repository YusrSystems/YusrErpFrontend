import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import ErrorBoundary from "./app/features/error/errorBoundary.tsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./app/core/state/store.ts";
import { ApiConstants } from "@yusr_systems/core";
import App from "./App.tsx";

ApiConstants.initialize("https://yusrerp.runasp.net/api");
// ApiConstants.initialize("https://localhost:7226/api");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={ store }>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Provider>
  </StrictMode>
);