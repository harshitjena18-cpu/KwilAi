import { useNavigate } from 'react-router';
import KwilAuth from '../components/kwil/KwilAuth';

export default function AuthPage() {
  const navigate = useNavigate();

  // This would be triggered on successful auth
  const handleAuthComplete = () => {
    navigate('/preferences');
  };

  return <KwilAuth />;
}
