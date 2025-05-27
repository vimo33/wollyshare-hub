import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { getTotalMembers } from '@/services/memberService';
import { retryWithBackoff } from '@/services/connectionService';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({
    itemsCount: '0',
    membersCount: '0',
    borrowedCount: '0'
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
        console.log("Fetching total stats from all users");
        
        // Fetch total items count with retry logic
        const itemsOperation = async () => {
          const { count: itemsCount, error: itemsError } = await supabase
            .from('items')
            .select('id', { count: 'exact', head: true });
          
          if (itemsError) throw itemsError;
          return itemsCount || 0;
        };

        // Fetch total members count with retry logic
        const membersOperation = async () => {
          return await getTotalMembers();
        };

        // Fetch ALL borrow requests (no status filter - auto-approved)
        const borrowedOperation = async () => {
          const { count: borrowedCount, error: borrowedError } = await supabase
            .from('borrow_requests')
            .select('id', { count: 'exact', head: true });

          if (borrowedError) throw borrowedError;
          return borrowedCount || 0;
        };

        // Execute all operations with retry logic
        const [itemsCount, totalMembers, borrowedCount] = await Promise.all([
          retryWithBackoff(itemsOperation),
          retryWithBackoff(membersOperation),
          retryWithBackoff(borrowedOperation)
        ]);

        console.log(`Stats: ${itemsCount} items, ${totalMembers} members, ${borrowedCount} items borrowed`);
        
        setStats({
          itemsCount: itemsCount.toString(),
          membersCount: totalMembers.toString(),
          borrowedCount: borrowedCount.toString()
        });
      } catch (error) {
        console.error('Error fetching statistics:', error);
        // Don't update stats on error to keep showing last known values
      }
    };

    // Fetch stats immediately when component mounts
    fetchStats();
    
    // Also set up a refresh interval to keep the stats updated
    const refreshInterval = setInterval(fetchStats, 60000); // Refresh every minute
    
    // Set up subscription for real-time updates to borrow requests
    const channel = supabase
      .channel('hero-stats-updates')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'borrow_requests'
        },
        (payload) => {
          console.log('Borrow request change detected in Hero component:', payload);
          // Refresh stats immediately for ANY borrow request change
          fetchStats();
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status for hero-stats-updates: ${status}`);
      });
    
    return () => {
      clearInterval(refreshInterval);
      supabase.removeChannel(channel);
    };
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
        </div>
        
        {/* Statistics - Shows all borrow requests as items are auto-approved */}
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
            <p className="text-muted-foreground">Total Users</p>
          </div>
          <div className="glass rounded-2xl p-6 text-center hover-lift">
            <div className="text-3xl font-bold mb-2">{stats.borrowedCount}</div>
            <p className="text-muted-foreground">Items Borrowed</p>
          </div>
        </div>
      </div>
      
      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default Hero;
