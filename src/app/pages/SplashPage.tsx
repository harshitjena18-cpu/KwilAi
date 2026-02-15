import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import KwilSplash from '../components/kwil/KwilSplash';

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('kwil_onboarding_complete');
    
    // Redirect after 3 seconds
    const timer = setTimeout(() => {
      if (hasCompletedOnboarding) {
        navigate('/app/home');
      } else {
        navigate('/onboarding');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return <KwilSplash />;
}
