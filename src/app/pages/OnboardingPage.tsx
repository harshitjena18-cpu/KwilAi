import { useNavigate } from 'react-router';
import KwilOnboarding from '../components/kwil/KwilOnboarding';

export default function OnboardingPage() {
  const navigate = useNavigate();

  // This would be triggered when onboarding is complete
  const handleOnboardingComplete = () => {
    localStorage.setItem('kwil_onboarding_complete', 'true');
    navigate('/auth');
  };

  // For now, we'll navigate after component mounts
  // In a real app, you'd pass handleOnboardingComplete to the component
  return <KwilOnboarding />;
}
