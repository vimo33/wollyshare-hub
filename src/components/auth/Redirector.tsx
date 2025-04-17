
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Redirector = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const destination = searchParams.get('destination');

  useEffect(() => {
    if (destination) {
      // Clean up the destination by removing any leading slashes or double slashes
      let cleanDestination = destination;
      
      // Remove leading slashes to avoid //path issues
      while (cleanDestination.startsWith('/')) {
        cleanDestination = cleanDestination.substring(1);
      }
      
      // Add a single leading slash back
      cleanDestination = '/' + cleanDestination;
      
      // Replace any double slashes with single slashes
      cleanDestination = cleanDestination.replace(/\/+/g, '/');
      
      console.log(`Redirecting to: ${cleanDestination}`);
      navigate(cleanDestination);
    } else {
      navigate('/auth');
    }
  }, [destination, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-lg font-medium mb-2">Redirecting...</h2>
        <p className="text-muted-foreground">Please wait while we redirect you.</p>
      </div>
    </div>
  );
};

export default Redirector;
