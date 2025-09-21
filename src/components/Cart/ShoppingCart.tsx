import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useApi } from '../../hooks/useApi';
import { API_ENDPOINTS } from '../../config/api';
import { formatCurrency, parsePrice } from '../../utils/formatters';

const ShoppingCart: React.FC = () => {
  const {
    items,
    totalItems,
    totalPrice,
    isOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const { apiCall } = useApi();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    setIsProcessing(true);
    try {
      // Process each item in the cart
      for (const item of items) {
        await apiCall(API_ENDPOINTS.SWEETS.PURCHASE(item.sweet.id), {
          method: 'POST',
          body: JSON.stringify({ quantity: item.quantity }),
        });
      }
      
      clearCart();
      alert('Purchase successful! Thank you for your order! 🍬');
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop with blur effect */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeCart} />
      
      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white/20 backdrop-blur-2xl shadow-2xl border-l border-white/30">
        <div className="flex h-full flex-col relative">
          {/* Floating background elements */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-32 left-10 w-16 h-16 bg-gradient-to-br from-orange-400/20 to-pink-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/20 px-6 py-6 bg-white/10 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Shopping Cart
                </h2>
                <p className="text-sm text-gray-600">{totalItems} items</p>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-xl hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-600 relative z-10">
                <div className="p-8 bg-white/20 backdrop-blur-sm rounded-3xl border border-white/30 text-center">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-lg font-medium mb-2">Your cart is empty</p>
                  <p className="text-sm text-center text-gray-500">
                    Browse our delicious sweets and add them to your cart!
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 relative z-10">
                {items.map((item) => (
                  <div key={item.id} className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/25">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-200/50 to-pink-200/50 rounded-xl overflow-hidden shadow-lg">
                        {item.sweet.image_url ? (
                          <img 
                            src={item.sweet.image_url} 
                            alt={item.sweet.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`w-full h-full flex items-center justify-center text-2xl ${item.sweet.image_url ? 'hidden' : ''}`}>
                          🍬
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {item.sweet.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">{item.sweet.category}</p>
                        <p className="text-sm font-semibold text-purple-700">
                          {formatCurrency(parsePrice(item.sweet.price))} each
                        </p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-3 bg-white/30 backdrop-blur-sm rounded-xl p-1 border border-white/40">
                            <button
                              onClick={() => updateQuantity(item.sweet.id, item.quantity - 1)}
                              className="p-1 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 rounded-lg hover:bg-white/30"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            
                            <span className="text-sm font-semibold text-gray-900 w-8 text-center">
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={() => updateQuantity(item.sweet.id, item.quantity + 1)}
                              className="p-1 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 rounded-lg hover:bg-white/30"
                              disabled={item.quantity >= item.sweet.quantity}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-bold text-gray-900">
                              {formatCurrency(parsePrice(item.sweet.price) * item.quantity)}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.sweet.id)}
                              className="p-2 text-red-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-100/30"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-white/20 px-6 py-6 space-y-6 bg-white/10 backdrop-blur-sm relative z-10">
              {/* Total */}
              <div className="flex justify-between items-center bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-purple-400 disabled:to-pink-400 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:transform-none disabled:hover:scale-100"
                >
                  {isProcessing ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      <span>Complete Purchase</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={clearCart}
                  className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-gray-700 font-medium py-3 px-6 rounded-2xl transition-all duration-300 border border-white/30 hover:border-white/50"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
