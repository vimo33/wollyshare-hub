
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Heart, Leaf, Users, RefreshCw, Sparkles, Globe } from "lucide-react";

const About = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#0FA0CE]">
          About WollyShare
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          A community-powered platform connecting neighbors through the sharing economy
        </p>
      </header>
      
      <section className="mb-16">
        <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
          <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
          <p className="text-gray-700 mb-4">
            WollyShare was born from a simple idea: what if we could easily share resources with our neighbors, reducing waste while building stronger community connections?
          </p>
          <p className="text-gray-700 mb-4">
            We envision neighborhoods where sharing is the norm — where borrowing a ladder, a power drill, or a cake pan from a neighbor is as easy as a few clicks, and where these small acts of sharing lead to deeper community bonds.
          </p>
          <p className="text-gray-700">
            By sharing more and buying less, we can reduce our environmental footprint, save money, and create more resilient communities built on trust and mutual support.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm flex">
            <div className="mr-6">
              <div className="rounded-full p-3 bg-green-100">
                <Globe className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Environmental Impact</h3>
              <p className="text-gray-600">
                Every shared item means one less item produced, packaged, shipped, and eventually discarded. By maximizing the use of existing resources, we reduce demand for new production and minimize waste.
              </p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm flex">
            <div className="mr-6">
              <div className="rounded-full p-3 bg-purple-100">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Community Building</h3>
              <p className="text-gray-600">
                Each borrowing interaction creates an opportunity for neighbors to meet, connect, and build relationships. These small connections form the foundation of vibrant, resilient communities.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="rounded-full p-4 bg-blue-100 mb-4 mx-auto w-16">
              <Heart className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">Trust</h3>
            <p className="text-gray-600 text-center">
              We believe in fostering a culture of trust where community members feel comfortable sharing their possessions with neighbors.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="rounded-full p-4 bg-green-100 mb-4 mx-auto w-16">
              <Leaf className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">Sustainability</h3>
            <p className="text-gray-600 text-center">
              By sharing resources instead of everyone owning everything, we reduce consumption and waste while making better use of what we already have.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="rounded-full p-4 bg-amber-100 mb-4 mx-auto w-16">
              <Sparkles className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">Generosity</h3>
            <p className="text-gray-600 text-center">
              We encourage a culture of abundance where sharing freely creates stronger bonds and more resilient communities.
            </p>
          </div>
        </div>
      </section>
      
      <section className="mb-16">
        <div className="bg-blue-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Open Source & Community-Owned</h2>
          <p className="text-gray-700 mb-4 text-center">
            WollyShare is built as an open-source platform, meaning any community can set up, host, and use it for free. Whether you're part of a neighborhood association, a housing cooperative, or a local sustainability initiative, you can take control by running WollyShare on your own infrastructure.
          </p>
          <p className="text-gray-700 text-center">
            This ensures privacy, autonomy, and the ability to adapt the platform to meet your community's specific needs.
          </p>
        </div>
      </section>
      
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Join The Movement</h2>
        <p className="text-xl text-center text-gray-600 mb-8">
          Whether you're sharing, borrowing, or simply connecting with neighbors, you're helping to build a more sustainable and connected community.
        </p>
        
        {!user && (
          <div className="text-center">
            <a 
              href="/auth" 
              className="inline-block px-6 py-3 bg-[#1EAEDB] hover:bg-[#0FA0CE] text-white rounded-md font-medium"
            >
              Sign Up Now
            </a>
          </div>
        )}
      </section>
    </div>
  );
};

export default About;
