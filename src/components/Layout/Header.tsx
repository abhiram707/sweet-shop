import React from 'react';
import { LogOut, User, ShoppingBag, ShoppingCart, Bell, Settings, Crown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

interface HeaderProps {
  onNavigateToAdmin?: () => void;
  showAdminButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onNavigateToAdmin, showAdminButton = true }) => {
  const { user, logout } = useAuth();
  const { totalItems, toggleCart } = useCart();

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 group cursor-pointer">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Sweet Shop
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Management System</p>
              </div>
            </div>
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="hidden sm:flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
                <div className="p-1 bg-purple-100 rounded-full">
                  <User className="h-4 w-4 text-purple-600" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{user?.email}</div>
                  {user?.role === 'admin' && (
                    <div className="text-xs text-purple-600 font-medium">Administrator</div>
                  )}
                </div>
              </div>
              
              {user?.role === 'admin' && (
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  ADMIN
                </span>
              )}
            </div>

            {/* Admin Panel Button */}
            {user?.role === 'admin' && showAdminButton && onNavigateToAdmin && (
              <button
                onClick={onNavigateToAdmin}
                className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Crown className="h-4 w-4" />
                <span className="hidden sm:inline">Admin Panel</span>
              </button>
            )}

            {/* Cart Button (for non-admin users) */}
            {user?.role !== 'admin' && (
              <button
                onClick={toggleCart}
                className="relative p-3 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg animate-pulse">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300"></div>
              </button>
            )}

            {/* Notifications */}
            <button className="relative p-3 text-gray-400 hover:text-purple-600 transition-colors duration-300 rounded-xl hover:bg-purple-50">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-all duration-300 px-3 py-2 rounded-xl hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;