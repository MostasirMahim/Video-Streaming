import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./components/socket/Socket.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    
      <QueryClientProvider client={queryClient}>
      <SocketProvider>
       <App />
      </SocketProvider>
        <Toaster />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
