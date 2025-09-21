import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import AuthPage from './components/Auth/AuthPage';
import Dashboard from './components/Dashboard/Dashboard';
import AdminPanel from './components/Admin/AdminPanel';
import ShoppingCart from './components/Cart/ShoppingCart';

type ViewMode = 'dashboard' | 'admin';

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');

  if (!user) {
    return <AuthPage />;
  }

  const navigateToAdmin = () => setCurrentView('admin');
  const navigateToDashboard = () => setCurrentView('dashboard');

  return (
    <>
      {currentView === 'dashboard' ? (
        <Dashboard onNavigateToAdmin={navigateToAdmin} />
      ) : (
        <AdminPanel onNavigateToDashboard={navigateToDashboard} />
      )}
      <ShoppingCart />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;