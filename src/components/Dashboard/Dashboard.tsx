import React, { useState, useEffect } from 'react';
import { Plus, Package2, TrendingUp, Users, Star, Crown, Sparkles } from 'lucide-react';
import { Sweet } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useApi, useApiState } from '../../hooks/useApi';
import { API_ENDPOINTS } from '../../config/api';
import { sanitizeSweets } from '../../utils/formatters';
import Header from '../Layout/Header';
import SearchBar, { SearchFilters } from '../Sweet/SearchBar';
import SweetCard from '../Sweet/SweetCard';
import { FeaturedSweetCard } from '../Sweet/FeaturedSweetCard';
import SweetForm from '../Sweet/SweetForm';
import RestockModal from '../Sweet/RestockModal';

interface DashboardProps {
  onNavigateToAdmin?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigateToAdmin }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [restockSweet, setRestockSweet] = useState<Sweet | null>(null);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });
  
  const { user } = useAuth();
  const { totalItems } = useCart();
  const { apiCall } = useApi();

  const { data: sweets, loading, error, execute: fetchSweets } = useApiState<Sweet[]>(
    [],
    async () => {
      const hasFilters = Object.values(searchFilters).some(value => value !== '');
      
      if (hasFilters) {
        const params = new URLSearchParams();
        if (searchFilters.name) params.append('name', searchFilters.name);
        if (searchFilters.category) params.append('category', searchFilters.category);
        if (searchFilters.minPrice) params.append('minPrice', searchFilters.minPrice);
        if (searchFilters.maxPrice) params.append('maxPrice', searchFilters.maxPrice);
        
        const result = await apiCall(`${API_ENDPOINTS.SWEETS.SEARCH}?${params.toString()}`);
        return sanitizeSweets(result.sweets || []);
      } else {
        const result = await apiCall(API_ENDPOINTS.SWEETS.LIST);
        return sanitizeSweets(result.sweets || []);
      }
    }
  );

  useEffect(() => {
    fetchSweets();
  }, [searchFilters]);

  const handleEdit = (sweet: Sweet) => {
    setEditingSweet(sweet);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingSweet(null);
  };

  const handleFormSuccess = () => {
    fetchSweets();
  };

  const handleRestockClose = () => {
    setRestockSweet(null);
  };

  const handleRestockSuccess = () => {
    fetchSweets();
  };

  const totalSweets = sweets.length;
  const inStockSweets = sweets.filter(sweet => sweet.quantity > 0).length;
  const lowStockSweets = sweets.filter(sweet => sweet.quantity > 0 && sweet.quantity <= 5).length;
  const totalValue = sweets.reduce((sum, sweet) => sum + (sweet.price * sweet.quantity), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating candy elements */}
        <div className="absolute top-20 left-20 text-4xl animate-bounce delay-1000">🍭</div>
        <div className="absolute top-40 right-32 text-3xl animate-bounce delay-2000">🍬</div>
        <div className="absolute bottom-32 left-1/4 text-4xl animate-bounce delay-3000">🧁</div>
        <div className="absolute bottom-20 right-20 text-3xl animate-bounce delay-4000">🍰</div>
        <div className="absolute top-1/3 right-1/4 text-2xl animate-bounce delay-500">🍪</div>
      </div>

      <Header onNavigateToAdmin={onNavigateToAdmin} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="relative">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-4 relative z-10">
              Sweet Shop Paradise
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent blur-lg opacity-30">
              Sweet Shop Paradise
            </div>
          </div>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed mb-6">
            {user?.role === 'admin' 
              ? 'Manage your sweet inventory and delight customers with premium confections'
              : 'Discover our delicious collection of premium sweets and treats'}
          </p>
          {user?.role !== 'admin' && totalItems > 0 && (
            <div className="mt-4 inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm border border-white/30 text-purple-800 px-6 py-3 rounded-full shadow-lg">
              <span className="font-medium">🛒 {totalItems} items in your cart</span>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:bg-white/25 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{totalSweets}</p>
                <p className="text-xs text-green-600 mt-1 font-medium">+12% from last month</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Package2 className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:bg-white/25 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">In Stock</p>
                <p className="text-3xl font-bold text-green-600">{inStockSweets}</p>
                <p className="text-xs text-green-600 mt-1 font-medium">Available now</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:bg-white/25 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Low Stock</p>
                <p className="text-3xl font-bold text-orange-600">{lowStockSweets}</p>
                <p className="text-xs text-orange-600 mt-1 font-medium">Needs attention</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Star className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:bg-white/25 group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Total Value</p>
                <p className="text-3xl font-bold text-purple-600">${totalValue.toFixed(0)}</p>
                <p className="text-xs text-purple-600 mt-1 font-medium">Inventory worth</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <SearchBar onSearch={setSearchFilters} />
            </div>
            
            {user?.role === 'admin' && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center space-x-3 shadow-xl hover:shadow-2xl transform hover:scale-105 backdrop-blur-sm border border-white/20"
              >
                <Plus className="h-5 w-5" />
                <span>Add New Sweet</span>
              </button>
            )}
          </div>
        </div>

        {/* Featured Sweets Section */}
        {!loading && !error && sweets.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Crown className="h-6 w-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-800">Featured Premium Sweets</h2>
              <Sparkles className="h-5 w-5 text-purple-500 animate-pulse" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Display first 2 sweets as featured */}
              {sweets.slice(0, 2).map((sweet) => (
                <FeaturedSweetCard
                  key={`featured-${sweet.id}`}
                  sweet={sweet}
                  userRole={user?.role}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent absolute top-0"></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50/80 backdrop-blur-lg border border-red-200/50 text-red-800 rounded-3xl p-8 text-center shadow-xl">
            <div className="text-4xl mb-4">😕</div>
            <p className="text-xl font-semibold mb-2">Oops! Something went wrong</p>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => fetchSweets()}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Sweets Grid */}
        {!loading && !error && (
          <>
            {sweets.length === 0 ? (
              <div className="text-center py-20 bg-white/20 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30">
                <div className="text-6xl mb-6">🍭</div>
                <p className="text-2xl font-bold text-gray-900 mb-3">No sweets found</p>
                <p className="text-gray-700 text-lg mb-8 max-w-md mx-auto">
                  {Object.values(searchFilters).some(value => value !== '')
                    ? 'Try adjusting your search filters to find the perfect sweet treat'
                    : user?.role === 'admin'
                    ? 'Ready to add your first delicious sweet to the collection?'
                    : 'Check back soon for amazing new treats!'
                  }
                </p>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
                  >
                    Add Your First Sweet
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* All Sweets Section Header */}
                <div className="flex items-center gap-3 mb-6">
                  <Package2 className="h-6 w-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-800">All Sweet Treats</h2>
                  <span className="bg-white/20 backdrop-blur-sm text-purple-800 px-4 py-2 rounded-full text-sm font-medium border border-white/30">
                    {sweets.length - 2} more items
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {/* Skip first 2 sweets as they're featured above */}
                  {sweets.slice(2).map((sweet) => (
                    <SweetCard
                      key={sweet.id}
                      sweet={sweet}
                      onUpdate={fetchSweets}
                      onEdit={handleEdit}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {showForm && (
        <SweetForm
          sweet={editingSweet || undefined}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {restockSweet && (
        <RestockModal
          sweet={restockSweet}
          onClose={handleRestockClose}
          onSuccess={handleRestockSuccess}
        />
      )}
    </div>
  );
};

export default Dashboard;