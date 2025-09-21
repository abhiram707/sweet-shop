import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Package2, 
  TrendingUp, 
  AlertTriangle, 
  Plus, 
  Edit3, 
  Trash2,
  DollarSign,
  Crown,
  Sparkles,
  Filter,
  Search,
  Download,
  ArrowLeft
} from 'lucide-react';
import { Sweet } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useApi, useApiState } from '../../hooks/useApi';
import Header from '../Layout/Header';
import SweetForm from '../Sweet/SweetForm';
import RestockModal from '../Sweet/RestockModal';

interface AdminPanelProps {
  onNavigateToDashboard?: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onNavigateToDashboard }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [restockSweet, setRestockSweet] = useState<Sweet | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const { user } = useAuth();
  const { apiCall } = useApi();

  const { data: sweets, loading, error, execute: fetchSweets } = useApiState<Sweet[]>(
    [],
    async () => {
      const result = await apiCall('/api/sweets');
      return result.sweets;
    }
  );

  useEffect(() => {
    fetchSweets();
  }, []);

  const handleEdit = (sweet: Sweet) => {
    setEditingSweet(sweet);
    setShowForm(true);
  };

  const handleDelete = async (sweet: Sweet) => {
    if (window.confirm(`Are you sure you want to delete "${sweet.name}"?`)) {
      try {
        await apiCall(`/api/sweets/${sweet.id}`, { method: 'DELETE' });
        fetchSweets();
      } catch (error) {
        console.error('Failed to delete sweet:', error);
        alert('Failed to delete sweet. Please try again.');
      }
    }
  };

  const handleRestock = (sweet: Sweet) => {
    setRestockSweet(sweet);
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

  // Filter sweets based on search and category
  const filteredSweets = sweets.filter(sweet => {
    const matchesSearch = sweet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (sweet.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || sweet.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Statistics
  const totalSweets = sweets.length;
  const inStockSweets = sweets.filter(sweet => sweet.quantity > 0).length;
  const lowStockSweets = sweets.filter(sweet => sweet.quantity > 0 && sweet.quantity <= 5).length;
  const totalValue = sweets.reduce((sum, sweet) => sum + (sweet.price * sweet.quantity), 0);

  // Categories
  const categories = Array.from(new Set(sweets.map(sweet => sweet.category))).filter(Boolean);

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 via-red-50 to-red-100 flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-8 text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-red-800 mb-2">Access Denied</h1>
          <p className="text-red-600">You need administrator privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-orange-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Floating admin elements */}
        <div className="absolute top-20 left-20 text-4xl animate-bounce delay-1000">⚙️</div>
        <div className="absolute top-40 right-32 text-3xl animate-bounce delay-2000">📊</div>
        <div className="absolute bottom-32 left-1/4 text-4xl animate-bounce delay-3000">👑</div>
        <div className="absolute bottom-20 right-20 text-3xl animate-bounce delay-4000">🛡️</div>
        <div className="absolute top-1/3 right-1/4 text-2xl animate-bounce delay-500">⚡</div>
      </div>

      <Header showAdminButton={false} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Back to Dashboard Button */}
        {onNavigateToDashboard && (
          <button
            onClick={onNavigateToDashboard}
            className="mb-6 flex items-center space-x-2 text-purple-600 hover:text-purple-800 transition-colors duration-300 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30 hover:bg-white/30"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
        )}

        {/* Admin Hero Section */}
        <div className="text-center mb-12">
          <div className="relative">
            <div className="flex items-center justify-center mb-4">
              <Crown className="h-12 w-12 text-yellow-500 mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                Admin Control Panel
              </h1>
              <Sparkles className="h-12 w-12 text-purple-500 ml-4 animate-pulse" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent blur-lg opacity-30">
              Admin Control Panel
            </div>
          </div>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed mb-6">
            Manage your sweet shop inventory, monitor sales, and control user access with powerful administrative tools.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <button
            onClick={() => setShowForm(true)}
            className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:bg-white/25 group text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <div className="text-green-600 font-semibold">Quick Action</div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Add New Sweet</h3>
            <p className="text-gray-600 text-sm">Create a new product in your inventory</p>
          </button>

          <button className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:bg-white/25 group text-left">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Download className="h-6 w-6 text-white" />
              </div>
              <div className="text-blue-600 font-semibold">Export</div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Export Data</h3>
            <p className="text-gray-600 text-sm">Download inventory and sales reports</p>
          </button>

          <button className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:bg-white/25 group text-left">
            <div className="flex items-center justify-between mb-4">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div className="text-purple-600 font-semibold">Configure</div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">System Settings</h3>
            <p className="text-gray-600 text-sm">Configure shop preferences and policies</p>
          </button>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:bg-white/25">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{totalSweets}</p>
                <p className="text-xs text-blue-600 mt-1 font-medium">Active inventory</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                <Package2 className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:bg-white/25">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">In Stock</p>
                <p className="text-3xl font-bold text-green-600">{inStockSweets}</p>
                <p className="text-xs text-green-600 mt-1 font-medium">Available items</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:bg-white/25">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Low Stock</p>
                <p className="text-3xl font-bold text-orange-600">{lowStockSweets}</p>
                <p className="text-xs text-orange-600 mt-1 font-medium">Need restocking</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:bg-white/25">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Total Value</p>
                <p className="text-3xl font-bold text-purple-600">${totalValue.toFixed(0)}</p>
                <p className="text-xs text-purple-600 mt-1 font-medium">Inventory worth</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 min-w-[200px]"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-gray-800 text-white">
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30">
              Showing {filteredSweets.length} of {totalSweets} products
            </div>
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent absolute top-0"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50/80 backdrop-blur-lg border border-red-200/50 text-red-800 rounded-3xl p-8 text-center shadow-xl">
            <div className="text-4xl mb-4">😕</div>
            <p className="text-xl font-semibold mb-2">Failed to load products</p>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={() => fetchSweets()}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-white/20 backdrop-blur-sm border-b border-white/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/20">
                  {filteredSweets.map((sweet) => (
                    <tr key={sweet.id} className="hover:bg-white/10 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-200/50 to-pink-200/50 rounded-xl flex items-center justify-center overflow-hidden">
                            {sweet.image_url ? (
                              <img 
                                src={sweet.image_url} 
                                alt={sweet.name}
                                className="w-full h-full object-cover rounded-xl"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  target.parentElement!.innerHTML = '<span class="text-xl">🍬</span>';
                                }}
                              />
                            ) : (
                              <span className="text-xl">🍬</span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{sweet.name}</div>
                            <div className="text-sm text-gray-600 truncate max-w-xs">{sweet.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100/50 text-purple-800">
                          {sweet.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        ${sweet.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        {sweet.quantity}
                      </td>
                      <td className="px-6 py-4">
                        {sweet.quantity === 0 ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100/50 text-red-800">
                            Out of Stock
                          </span>
                        ) : sweet.quantity <= 5 ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100/50 text-orange-800">
                            Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100/50 text-green-800">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(sweet)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100/30 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRestock(sweet)}
                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100/30 rounded-lg transition-colors"
                            title="Restock"
                          >
                            <Package2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(sweet)}
                            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100/30 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredSweets.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📦</div>
                <p className="text-lg font-medium text-gray-900 mb-2">No products found</p>
                <p className="text-gray-600">
                  {searchTerm || selectedCategory 
                    ? 'Try adjusting your search filters' 
                    : 'Start by adding your first product'
                  }
                </p>
              </div>
            )}
          </div>
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

export default AdminPanel;
