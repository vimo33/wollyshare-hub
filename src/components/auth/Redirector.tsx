
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Redirector = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const destination = searchParams.get('destination');

  useEffect(() => {
    if (destination) {
      // Clean up the destination by removing any leading slashes
      const cleanDestination = destination.replace(/^\/+/, '/');
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
