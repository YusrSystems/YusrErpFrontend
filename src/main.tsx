import { ApiConstants } from "@yusr_systems/core";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./app";
import ErrorBoundary from "./features/error/errorBoundary";
import "./index.css";
import { store } from "./core/state/store";

ApiConstants.initialize("https://yusrerp.runasp.net/api");
// ApiConstants.initialize("https://localhost:7142/api");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={ store }>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Provider>
  </StrictMode>
);
