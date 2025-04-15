
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Leaf, Users, RefreshCw, Package } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#0FA0CE]">
            Share Resources, Build Community
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            WollyShare helps neighbors share goods and build stronger connections. Borrow what you need, share what you have.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              onClick={() => navigate("/auth")} 
              size="lg"
              className="bg-[#1EAEDB] hover:bg-[#0FA0CE] text-white px-8"
            >
              Join Our Community
            </Button>
            <Button 
              onClick={() => navigate("/how-it-works")} 
              variant="outline" 
              size="lg"
            >
              How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Join WollyShare?</h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full p-4 bg-green-100 mb-4">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Sustainability</h3>
              <p className="text-gray-600">
                Reduce waste and environmental impact by sharing resources instead of buying new items that are rarely used.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full p-4 bg-blue-100 mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Building</h3>
              <p className="text-gray-600">
                Connect with neighbors, make new friends, and strengthen your local community through the sharing economy.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="rounded-full p-4 bg-purple-100 mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Save Money</h3>
              <p className="text-gray-600">
                Access items you need without having to buy them. Share what you already own to help others do the same.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Summary */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Simple Sharing Process</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-blue-100 p-3 mr-4">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">1. Add Your Items</h3>
              </div>
              <p className="text-gray-600">
                List items you're willing to share with your community. Add photos and details to help others find what they need.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-blue-100 p-3 mr-4">
                  <RefreshCw className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">2. Borrow & Share</h3>
              </div>
              <p className="text-gray-600">
                Browse items available in your community. Request to borrow what you need, and approve requests for your items.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-blue-100 p-3 mr-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">3. Connect</h3>
              </div>
              <p className="text-gray-600">
                Meet your neighbors when exchanging items. Build relationships and strengthen your local community through sharing.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Button 
              onClick={() => navigate("/how-it-works")} 
              variant="outline"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Community Stories Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Community-Centered Design</h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            WollyShare is built for communities, by communities. Our platform is designed to strengthen local connections and empower sustainable living through sharing.
          </p>
          
          <div className="bg-blue-50 p-6 md:p-10 rounded-lg">
            <blockquote className="text-xl md:text-2xl font-light text-gray-700 mb-6">
              "Sharing isn't just about saving money or reducing waste—although those are great benefits. It's about creating a culture where we rely on each other, where we build trust and connection through everyday acts of generosity."
            </blockquote>
            <p className="font-semibold">— WollyShare Community Vision</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#33C3F0] to-[#0FA0CE] text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Sharing?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join WollyShare today and be part of a movement to create more connected, sustainable communities through sharing.
          </p>
          <Button 
            onClick={() => navigate("/auth")} 
            variant="secondary"
            size="lg"
          >
            Sign Up Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
