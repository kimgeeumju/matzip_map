import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "sonner";

ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
).render(
  <React.StrictMode>
    <>
      <App />
      {/* 전역 토스트 알림 */}
      <Toaster position="top-center" richColors />
    </>
  </React.StrictMode>,
);