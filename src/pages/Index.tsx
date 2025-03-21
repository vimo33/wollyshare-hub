
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Hero from "@/components/Hero";
import ItemGrid from "@/components/ItemGrid";

const Index = () => {
  const { profile } = useAuth();

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Add debugging to verify we're on the home page
    console.log("Home page mounted - should show ALL items");
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <main>
        <Hero />
        {/* Explicitly pass props to ensure we show all items */}
        <ItemGrid />
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-wolly-green flex items-center justify-center">
                <span className="text-green-800 font-bold text-sm">W</span>
              </div>
              <span className="font-semibold">WollyShare</span>
            </div>
            <p className="text-sm text-muted-foreground">
              A community-driven platform to share and borrow items, reducing waste and building connections.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Community Guidelines</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">FAQs</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-200 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} WollyShare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
