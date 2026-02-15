import { createBrowserRouter, Navigate } from 'react-router';
import AppLayout from './layouts/AppLayout';
import SplashPage from './pages/SplashPage';
import OnboardingPage from './pages/OnboardingPage';
import AuthPage from './pages/AuthPage';
import PreferencesPage from './pages/PreferencesPage';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import RecipesPage from './pages/RecipesPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import CookingModePage from './pages/CookingModePage';
import HealthPage from './pages/HealthPage';
import ProfilePage from './pages/ProfilePage';
import ScannerPage from './pages/ScannerPage';
import ShoppingListPage from './pages/ShoppingListPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SplashPage />,
  },
  {
    path: '/onboarding',
    element: <OnboardingPage />,
  },
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    path: '/preferences',
    element: <PreferencesPage />,
  },
  {
    path: '/dashboard',
    element: <Navigate to="/app/home" replace />,
  },
  {
    path: '/app',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/app/home" replace />,
      },
      {
        path: 'home',
        element: <HomePage />,
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
      {
        path: 'recipes',
        element: <RecipesPage />,
      },
      {
        path: 'recipe/:id',
        element: <RecipeDetailPage />,
      },
      {
        path: 'recipes/:id',
        element: <RecipeDetailPage />,
      },
      {
        path: 'recipes/:id/cook',
        element: <CookingModePage />,
      },
      {
        path: 'health',
        element: <HealthPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'scanner',
        element: <ScannerPage />,
      },
      {
        path: 'shopping-list',
        element: <ShoppingListPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);