
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
import AdminCommunitySettings from "./pages/AdminCommunitySettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin/auth" element={<AdminAuth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/members" element={<AdminMembers />} />
            {/* Add a redirect from the old invitations route to the new members route */}
            <Route path="/admin/invitations" element={<Navigate to="/admin/members" replace />} />
            <Route path="/admin/community-settings" element={<AdminCommunitySettings />} />
            <Route path="/browse" element={<Index />} /> {/* Temporary routing to Index */}
            <Route path="/my-items" element={<Index />} /> {/* Temporary routing to Index */}
            <Route path="/requests" element={<Index />} /> {/* Temporary routing to Index */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
