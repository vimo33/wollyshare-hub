
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminAuth from "./pages/AdminAuth";
import Admin from "./pages/Admin";
import AdminMembers from "./pages/AdminMembers";
import AdminAddExistingUsers from "./pages/AdminAddExistingUsers";
import AdminCommunitySettings from "./pages/AdminCommunitySettings";
import HowItWorks from "./pages/HowItWorks";
import MyItems from "./pages/MyItems";
import Profile from "./pages/Profile";
import About from "./pages/About";
import { useAuth } from "@/contexts/AuthContext";
import MobileBottomNav from "@/components/mobile/MobileBottomNav";
import Redirector from "@/components/auth/Redirector";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, isLoading } = useAuth();
  if (isLoading) return <div className="container mx-auto mt-12 p-4">Loading...</div>;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/auth" element={<Auth />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="reset-password" element={<ResetPassword />} />
    <Route path="/redirect" element={<Redirector />} />
    <Route path="/admin/auth" element={<AdminAuth />} />
    <Route path="/how-it-works" element={<HowItWorks />} />
    <Route path="/about" element={<About />} />
    <Route path="/my-items" element={<MyItems />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
    <Route path="/admin/members" element={<AdminRoute><AdminMembers /></AdminRoute>} />
    <Route path="/admin/add-existing-users" element={<AdminRoute><AdminAddExistingUsers /></AdminRoute>} />
    <Route path="/admin/invitations" element={<Navigate to="/admin/members" replace />} />
    <Route path="/admin/community-settings" element={<AdminRoute><AdminCommunitySettings /></AdminRoute>} />
    <Route path="/browse" element={<Index />} />
    <Route path="/requests" element={<Index />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
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
);

export default App;
