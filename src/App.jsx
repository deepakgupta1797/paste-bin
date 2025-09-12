import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import CreatePastePage from "./pages/CreatePastePage";
import Paste from "./components/Paste";
import ViewPaste from "./components/ViewPaste";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import BlogPage from "./pages/BlogPage";
import CreateBlogPostPage from "./pages/CreateBlogPostPage";
import ViewBlogPostPage from "./pages/ViewBlogPostPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminPage from "./pages/Admin";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import AccountPage from "./components/AccountPage";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "./redux/authSlice";
import SearchResultsPage from "./pages/SearchResultsPage";

const router = createBrowserRouter([
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },

      {
        path: "pastes",
        element: <Paste />,
      },
      {
        path: "pastes/:id",
        element: <ViewPaste />,
      },
      {
        path: "blogs",
        element: <BlogPage />,
      },
      {
        path: "blogs/:id",
        element: <ViewBlogPostPage />,
      },
      { 
        path: 'search',
        element: <SearchResultsPage /> 
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignUpPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "pastes/create",
            element: <CreatePastePage />,
          },
          {
            path: "blogs/create",
            element: <CreateBlogPostPage />,
          },
          {
            path: "change-password",
            element: <ChangePasswordPage />,
          },
          {
            path: "account",
            element: <AccountPage />,
          },
        ],
      },

      {
        element: <ProtectedRoute adminOnly={true} />,
        children: [
          {
            path: "admin",
            element: <AdminPageWrapper />,
          },
        ],
      },
    ],
  },

  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

function AdminPageWrapper() {
  const currentUser = useSelector(selectCurrentUser);

  return (
    <AdminPage
      isUserAdmin={currentUser?.role === "admin"}
      currentAdmin={currentUser}
    />
  );
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
