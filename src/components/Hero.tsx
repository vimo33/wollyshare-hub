
import { ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({
    itemsCount: '0',
    membersCount: '0',
    categoriesCount: '0'
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch items count
        const { count: itemsCount, error: itemsError } = await supabase
          .from('items')
          .select('id', { count: 'exact', head: true });

        // Log all profiles first to debug
        const { data: allProfiles, error: allProfilesError } = await supabase
          .from('profiles')
          .select('*');
        
        console.log('All profiles:', allProfiles);
        
        if (allProfilesError) {
          console.error('Error fetching all profiles:', allProfilesError);
        }

        // Fetch members count - we'll count all profiles for now since we're debugging
        const { data: membersData, error: membersError } = await supabase
          .from('profiles')
          .select('id');
        
        console.log('Members data:', membersData);

        // Fetch unique categories count
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('items')
          .select('category')
          .limit(1000);

        if (itemsError) {
          console.error('Error fetching items count:', itemsError);
        }

        if (membersError) {
          console.error('Error fetching members count:', membersError);
        }

        if (categoriesError) {
          console.error('Error fetching categories:', categoriesError);
        }

        // Get unique categories count
        const uniqueCategories = categoriesData 
          ? [...new Set(categoriesData.map(item => item.category))]
          : [];

        // For now, let's count all profiles as members
        const memberCount = membersData ? membersData.length : 0;

        setStats({
          itemsCount: itemsCount?.toString() || '0',
          membersCount: memberCount.toString(),
          categoriesCount: uniqueCategories.length.toString() || '0'
        });
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="pt-28 pb-20 px-6 md:pt-40 md:pb-32 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-20 right-1/4 w-24 h-24 rounded-full bg-wolly-yellow opacity-70 blur-xl animate-pulse-soft"></div>
      <div className="absolute bottom-20 left-1/5 w-32 h-32 rounded-full bg-wolly-pink opacity-70 blur-xl animate-pulse-soft"></div>
      <div className="absolute top-40 left-10 w-16 h-16 rounded-full bg-wolly-green opacity-70 blur-xl animate-pulse-soft"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className={cn(
          "text-center transform transition-all duration-1000",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          <div className="inline-block mb-4 px-4 py-2 rounded-full bg-wolly-blue/30 backdrop-blur-sm">
            <span className="text-sm font-medium text-blue-800">Community-Powered Sharing ✨</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
            Share what you have,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              borrow what you need
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with your community and share resources, from tools to kitchen appliances, 
            all in one simple platform.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button className="px-8 py-3 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors shadow-sm w-full sm:w-auto">
              Discover Items
            </button>
            <Link to="/how-it-works" className="px-8 py-3 rounded-full bg-secondary hover:bg-secondary/80 transition-colors flex items-center justify-center gap-1 w-full sm:w-auto">
              <span>How it works</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        
        {/* Statistics - updated to use dynamic data */}
        <div className={cn(
          "grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 delay-300",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          <div className="glass rounded-2xl p-6 text-center hover-lift">
            <div className="text-3xl font-bold mb-2">{stats.itemsCount}+</div>
            <p className="text-muted-foreground">Items Available</p>
          </div>
          <div className="glass rounded-2xl p-6 text-center hover-lift">
            <div className="text-3xl font-bold mb-2">{stats.membersCount}</div>
            <p className="text-muted-foreground">Active Members</p>
          </div>
          <div className="glass rounded-2xl p-6 text-center hover-lift">
            <div className="text-3xl font-bold mb-2">{stats.categoriesCount}</div>
            <p className="text-muted-foreground">Categories Available</p>
          </div>
        </div>
      </div>
      
      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default Hero;
