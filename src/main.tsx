import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from './contexts/AuthContext';
import { FormsProvider } from './contexts/FormsContext';

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <FormsProvider>
      <App />
    </FormsProvider>
  </AuthProvider>
);
