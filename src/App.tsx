
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AdminAuth from "./pages/AdminAuth";
import Admin from "./pages/Admin";
import AdminMembers from "./pages/AdminMembers";
import AdminAddExistingUsers from "./pages/AdminAddExistingUsers";
import AdminCommunitySettings from "./pages/AdminCommunitySettings";
import HowItWorks from "./pages/HowItWorks";
import MyItems from "./pages/MyItems";
import Profile from "./pages/Profile";
import { useAuth } from "@/contexts/AuthContext";
import MobileBottomNav from "@/components/mobile/MobileBottomNav";

const queryClient = new QueryClient();

// Admin route guard component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="container mx-auto mt-12 p-4">Loading...</div>;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/admin/auth" element={<AdminAuth />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/my-items" element={<MyItems />} />
      <Route path="/profile" element={<Profile />} />
      
      {/* Protected Admin Routes */}
      <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
      <Route path="/admin/members" element={<AdminRoute><AdminMembers /></AdminRoute>} />
      <Route path="/admin/add-existing-users" element={<AdminRoute><AdminAddExistingUsers /></AdminRoute>} />
      <Route path="/admin/invitations" element={<Navigate to="/admin/members" replace />} />
      <Route path="/admin/community-settings" element={<AdminRoute><AdminCommunitySettings /></AdminRoute>} />
      
      <Route path="/browse" element={<Index />} /> {/* Temporary routing to Index */}
      <Route path="/requests" element={<Index />} /> {/* Temporary routing to Index */}
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Header />
          <AppRoutes />
          <MobileBottomNav />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
