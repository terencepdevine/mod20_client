import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { queryClient } from "./query/queryClient";
import appRoutes from "./routes/appRoutes";
import AppLayout from "./components/layout/AppLayout";
import systemRoutes from "./routes/systemRoutes";
import adminRoutes from "./routes/adminRoutes";
import { ToastContainer } from "react-toastify";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [...appRoutes, ...systemRoutes, ...adminRoutes],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <RouterProvider router={router} />

      <ToastContainer
        position="bottom-right"
        theme="dark"
        toastClassName={() =>
          "relative flex p-3 min-h-10 rounded-md bg-gray-800 text-gray-300 shadow-lg"
        }
        autoClose={5000}
        hideProgressBar={false}
        progressClassName="bg-sky-500"
      />
    </QueryClientProvider>
  );
}

export default App;
