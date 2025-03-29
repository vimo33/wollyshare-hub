
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Index from "./pages/Index";
import MyItems from "./pages/MyItems";
import Profile from "./pages/Profile";
import Authentication from "./pages/Authentication"; // Reverted to working relative path
import { ErrorBoundary } from 'react-error-boundary';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />
  },
  {
    path: "/my-items",
    element: <MyItems />
  },
  {
    path: "/profile",
    element: <Profile />
  },
  {
    path: "/auth",
    element: <Authentication />
  }
]);

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
