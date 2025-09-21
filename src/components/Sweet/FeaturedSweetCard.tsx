import React, { useState } from 'react';
import { ShoppingCart, Star, Crown, Sparkles, Timer, Award } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { Sweet } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface FeaturedSweetCardProps {
  sweet: Sweet;
  userRole?: string;
  onEdit?: (sweet: Sweet) => void;
  onDelete?: (id: string) => void;
}

export const FeaturedSweetCard: React.FC<FeaturedSweetCardProps> = ({ 
  sweet, 
  userRole,
  onEdit,
  onDelete 
}) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      addToCart(sweet, quantity);
      setQuantity(1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="featured-card relative bg-gradient-animated rounded-3xl overflow-hidden shadow-2xl group pulse-glow slide-up">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/90 via-pink-500/90 to-red-500/90"></div>
      
      {/* Crown badge */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
          <Crown size={14} className="fill-current" />
          FEATURED
        </div>
      </div>

      {/* Sparkle effects */}
      <div className="absolute top-6 right-6 text-yellow-300 animate-float">
        <Sparkles size={24} />
      </div>
      <div className="absolute bottom-6 left-6 text-yellow-300 rotate-slow">
        <Sparkles size={16} />
      </div>

      <div className="relative z-10 p-8 text-white">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-3xl font-bold mb-2 text-shadow-lg">
            {sweet.name}
          </h3>
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium border border-white/30">
              {sweet.category}
            </span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="text-yellow-400 fill-current" />
              ))}
              <span className="text-sm ml-1">Premium Quality</span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
              <img
                src={sweet.image_url || 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400'}
                alt={sweet.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400') {
                    target.src = 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400';
                  }
                }}
              />
            </div>
            {/* Floating price */}
            <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 text-2xl font-bold px-4 py-2 rounded-full shadow-lg border-4 border-white">
              {formatCurrency(sweet.price)}
            </div>
          </div>

          {/* Details */}
          <div>
            <p className="text-white/90 mb-4 text-lg leading-relaxed">
              {sweet.description || `Experience the ultimate ${sweet.name.toLowerCase()} crafted with premium ingredients and artisanal techniques.`}
            </p>

            {/* Features */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <Timer className="text-yellow-400" size={20} />
                <span>Fresh daily preparation</span>
              </div>
              <div className="flex items-center gap-3">
                <Award className="text-yellow-400" size={20} />
                <span>Premium ingredients only</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="text-yellow-400 fill-current" size={20} />
                <span>Customer favorite choice</span>
              </div>
            </div>

            {/* Stock info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Available Stock</span>
                <span className="text-lg font-bold">{sweet.quantity} units</span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-400 to-yellow-400 transition-all duration-500"
                  style={{ width: `${Math.min((sweet.quantity / 50) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Action button */}
            {sweet.quantity > 0 ? (
              <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="btn-ripple w-full bg-white text-purple-600 hover:bg-yellow-400 hover:text-yellow-900 font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    Add Premium Sweet to Cart
                  </>
                )}
              </button>
            ) : (
              <button
                disabled
                className="w-full bg-gray-500 text-white font-bold py-4 px-6 rounded-xl cursor-not-allowed"
              >
                Currently Unavailable
              </button>
            )}

            {/* Admin actions */}
            {userRole === 'admin' && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => onEdit?.(sweet)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete?.(sweet.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom highlight */}
        <div className="mt-6 pt-6 border-t border-white/20">
          <div className="text-center">
            <p className="text-white/80 text-sm">
              ⭐ Limited time featured sweet - Don't miss out! ⭐
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
