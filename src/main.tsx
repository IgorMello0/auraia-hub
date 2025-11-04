import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { FormsProvider } from './contexts/FormsContext';

createRoot(document.getElementById("root")!).render(
  <FormsProvider>
    <App />
  </FormsProvider>
);
