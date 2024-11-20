import { createBrowserRouter, RouterProvider } from "react-router-dom";

import AppLayout from "./components/AppLayout";

import appRoutes from "./routes/appRoutes";
import systemRoutes from "./routes/systemRoutes";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./query/queryClient";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [...appRoutes, ...systemRoutes],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
