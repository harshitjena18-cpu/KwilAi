import { useParams, useNavigate } from 'react-router';
import KwilCookingMode from '../components/kwil/KwilCookingMode';

export default function CookingModePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <KwilCookingMode 
      recipeId={id || 'recipe-demo-001'}
      recipeName="Grilled Chicken Power Salad"
      onExit={() => navigate(-1)}
      onComplete={() => navigate('/app/health')}
    />
  );
}
