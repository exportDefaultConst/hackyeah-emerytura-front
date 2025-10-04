import { createBrowserRouter, RouterProvider } from "react-router";
import AppLayout from "./layout/AppLayout";
import PageExample from "./pages/PageExample";
import Account from "./pages/Account";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <div>error</div>,
    children: [
      {
        path: "/",
        element: <div>testtesttest</div>,
        errorElement: <div>error on path: "/"</div>,
      },
      {
        path: "/moje-konto",
        element: <Account />,
        errorElement: <div>error on path: "/moje-konto"</div>,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
