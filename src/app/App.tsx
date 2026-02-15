import { RouterProvider } from 'react-router';
import { router } from './routes';

export default function App() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4" 
      style={{ backgroundColor: '#050B08' }}
    >
      {/* Mobile Frame */}
      <div 
        className="relative overflow-hidden rounded-[3rem] shadow-2xl border-8 border-gray-900"
        style={{ 
          width: '390px', 
          height: '844px',
          backgroundColor: '#050B08'
        }}
      >
        <RouterProvider router={router} />
      </div>
    </div>
  );
}
