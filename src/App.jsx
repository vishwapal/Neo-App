import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import SpinnerFullPage from "./components/SpinnerFullPage";
import Layout from "./pages/Layout";
import PrivateRoute from "./pages/PrivateRoute";
import Search from "./pages/Search";
import StaticHomepage from "./pages/StaticHomepage";

const ErrorPage = lazy(() => import("./components/ErrorPage"));
const Homepage = lazy(() => import("./pages/Homepage"));
const ProductList = lazy(() => import("./components/ProductList"));
const Product = lazy(() => import("./components/Product"));
const ProductItem = lazy(() => import("./components/ProductItem"));
const Cart = lazy(() => import("./components/Cart"));

// Create Browser Router
const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <StaticHomepage /> },
      {
        element: <PrivateRoute />,
        children: [
          { path: "/app/products", element: <ProductList /> },
          { path: "/app/products/:id", element: <Product /> },
          { path: "/app/product", element: <ProductItem /> },
          { path: "/cart", element: <Cart /> },
          { path: "/home", element: <Homepage /> },
          { path: "/search", element: <Search /> },
        ],
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
]);

function App() {
  return (
    <Suspense fallback={<SpinnerFullPage />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
