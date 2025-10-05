import { createBrowserRouter, RouterProvider } from "react-router";
import AppLayout from "./layout/AppLayout";
import PageExample from "./pages/PageExample";
import Account from "./pages/Account";
import FrontPage from "./pages/FrontPage";
import UserEstimationPage from "./pages/UserEstimationPage";
import UserFormPage from "./pages/UserFormPage";
import DashboardPage from "./pages/DashboardPage";
import AdminDashboard from "./pages/AdminDashboard";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <div>error</div>,
    children: [
      {
        path: "/",
        element: <FrontPage />,
        errorElement: <div>error on path: "/"</div>,
      },
      {
        path: "/jaka-chcesz",
        element: <UserEstimationPage />,
        errorElement: <div>error on path: "/jaka-chcesz"</div>,
      },
      {
        path: "/wprowadz-dane",
        element: <UserFormPage />,
        errorElement: <div>error on path: "/wprowadz-dane"</div>,
      },
      {
        path: "/dashboard",
        element: <DashboardPage />,
        errorElement: <div>error on path: "/dashboard"</div>,
      },
      {
        path: "/admin-dashboard",
        element: <AdminDashboard />,
        errorElement: <div>error on path: "/admin-dashboard"</div>,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
