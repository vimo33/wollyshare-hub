
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Check } from 'lucide-react';

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

        // Fetch members count - correctly filtering by is_member flag
        const { data: membersData, error: membersError } = await supabase
          .from('profiles')
          .select('id')
          .eq('is_member', true);

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

        setStats({
          itemsCount: itemsCount?.toString() || '0',
          membersCount: membersData?.length.toString() || '0',
          categoriesCount: uniqueCategories.length.toString() || '0'
        });
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStats();
  }, []);

  const howItWorksSteps = [
    "Join the App with an invitation from your community administrator",
    "Set up your profile with your details and convenient pickup times",
    "Share items you own by listing them in the app",
    "Search or browse to find items you need to borrow",
    "Return items to their owners during convenient times"
  ];

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
          
          {/* How It Works Section - replacing buttons */}
          <div className="mb-16 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">How It Works</h2>
            <div className="glass rounded-2xl p-8 text-left">
              <ul className="space-y-3">
                {howItWorksSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="bg-wolly-green/20 p-1 rounded-full mt-0.5">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
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
