
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Index from "./pages/Index";
import MyItems from "./pages/MyItems";
import Profile from "./pages/Profile";
import RootLayout from "./pages/RootLayout";
import Authentication from "./pages/Authentication";
import { ErrorBoundary } from 'react-error-boundary';

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: "my-items",
        element: <MyItems />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Authentication />,
  },
]);

// Modify the main component to include the error boundary
const App = () => {
  return (
    <ErrorBoundary fallback={<div className="container p-6 text-center">
      <h2 className="text-xl font-bold text-red-600 mb-4">Something went wrong</h2>
      <p className="mb-4">We're sorry, but there was an error in the application.</p>
      <button 
        className="bg-primary text-white px-4 py-2 rounded"
        onClick={() => window.location.reload()}
      >
        Refresh the page
      </button>
    </div>}>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
};

export default App;
