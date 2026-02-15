import { useNavigate } from 'react-router';
import KwilPreferences from '../components/kwil/KwilPreferences';

export default function PreferencesPage() {
  const navigate = useNavigate();

  // This would be triggered when preferences are saved
  const handlePreferencesComplete = () => {
    navigate('/app/home');
  };

  return <KwilPreferences />;
}
