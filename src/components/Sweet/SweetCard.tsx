import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Star, Clock, Award, Heart, Eye } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { Sweet } from '../../types';

interface SweetCardProps {
  sweet: Sweet;
  userRole?: string;
  onEdit?: (sweet: Sweet) => void;
  onDelete?: (id: string) => void;
  onUpdate?: () => void;
}

// High-quality sweet images for better visual appeal
const getSweetImage = (name: string, category: string) => {
  const imageMap: { [key: string]: string } = {
    'chocolate chip cookies': 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&h=400&fit=crop&auto=format',
    'red velvet cupcake': 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=500&h=400&fit=crop&auto=format',
    'dark chocolate bar': 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500&h=400&fit=crop&auto=format',
    'strawberry gummy bears': 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=500&h=400&fit=crop&auto=format',
    'vanilla macarons': 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=500&h=400&fit=crop&auto=format',
    'caramel lollipops': 'https://images.unsplash.com/photo-1603893603637-80ac0bd48b64?w=500&h=400&fit=crop&auto=format',
    'mint chocolate truffles': 'https://images.unsplash.com/photo-1549042256-0e9c4b0d9e3f?w=500&h=400&fit=crop&auto=format',
    'rainbow sour strips': 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=500&h=400&fit=crop&auto=format'
  };

  const categoryImages: { [key: string]: string } = {
    'cookies': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&h=400&fit=crop&auto=format',
    'cupcakes': 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=500&h=400&fit=crop&auto=format',
    'chocolate': 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=500&h=400&fit=crop&auto=format',
    'gummies': 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=500&h=400&fit=crop&auto=format',
    'macarons': 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=500&h=400&fit=crop&auto=format',
    'lollipops': 'https://images.unsplash.com/photo-1603893603637-80ac0bd48b64?w=500&h=400&fit=crop&auto=format',
    'sour candy': 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=500&h=400&fit=crop&auto=format'
  };

  return imageMap[name.toLowerCase()] || 
         categoryImages[category.toLowerCase()] || 
         'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&h=400&fit=crop&auto=format';
};

export const SweetCard: React.FC<SweetCardProps> = ({ 
  sweet, 
  userRole,
  onEdit,
  onDelete 
}) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      addToCart(sweet, quantity);
      setQuantity(1); // Reset quantity after adding
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const increaseQuantity = () => {
    if (quantity < sweet.quantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const rating = Math.floor(Math.random() * 2) + 4; // Random rating between 4-5
  const reviewCount = Math.floor(Math.random() * 50) + 10; // Random review count

  return (
    <div 
      className="sweet-card bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 overflow-hidden border border-gray-100 group bounce-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
        {/* Always show image - prioritize database image_url first */}
        <img
          src={sweet.image_url || getSweetImage(sweet.name, sweet.category)}
          alt={sweet.name}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
          onError={(e) => {
            const target = e.currentTarget;
            // Try fallback image
            const fallbackUrl = getSweetImage(sweet.name, sweet.category);
            if (target.src !== fallbackUrl) {
              target.src = fallbackUrl;
            } else {
              // If fallback also fails, use default
              target.src = 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&h=400&fit=crop&auto=format';
            }
          }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Action buttons overlay */}
        <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
        }`}>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors duration-200 ${
              isFavorite 
                ? 'bg-red-500 text-white heart-beat' 
                : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
            }`}
          >
            <Heart size={16} className={isFavorite ? 'fill-current' : ''} />
          </button>
          <button className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-blue-500 hover:text-white backdrop-blur-sm transition-colors duration-200">
            <Eye size={16} />
          </button>
        </div>

        {/* Status badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {sweet.quantity > 0 ? (
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 backdrop-blur-sm">
              <Clock size={12} />
              Available
            </span>
          ) : (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
              Out of Stock
            </span>
          )}
          
          {sweet.quantity < 10 && sweet.quantity > 0 && (
            <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm animate-pulse">
              Low Stock
            </span>
          )}
        </div>

        {/* Price badge */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-lg font-bold backdrop-blur-sm">
            ${sweet.price}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-purple-600 transition-colors duration-300">
              {sweet.name}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                <Award size={12} className="mr-1" />
                {sweet.category}
              </span>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={12} 
                    className={`${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
                <span className="text-xs text-gray-500 ml-1">({reviewCount})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {sweet.description || `Delicious ${sweet.name.toLowerCase()} made with premium ingredients. Perfect for any sweet tooth!`}
        </p>

        {/* Stock and Price */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-800">
              ${sweet.price}
            </span>
            <span className="text-xs text-gray-500">
              {sweet.quantity} in stock
            </span>
          </div>
          
          {/* Progress bar for stock */}
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500 mb-1">Stock Level</span>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  sweet.quantity > 20 ? 'bg-green-500' : 
                  sweet.quantity > 10 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min((sweet.quantity / 50) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quantity Selector */}
        {sweet.quantity > 0 && (
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-xl">
            <span className="text-sm font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center gap-3">
              <button
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:border-purple-400 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center font-semibold text-lg">{quantity}</span>
              <button
                onClick={increaseQuantity}
                disabled={quantity >= sweet.quantity}
                className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:border-purple-400 hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          {sweet.quantity > 0 ? (
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="btn-ripple flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-102 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShoppingCart size={18} />
                  Add to Cart
                </>
              )}
            </button>
          ) : (
            <button
              disabled
              className="flex-1 bg-gray-300 text-gray-500 font-semibold py-3 px-4 rounded-xl cursor-not-allowed"
            >
              Out of Stock
            </button>
          )}

          {/* Admin Actions */}
          {userRole === 'admin' && (
            <div className="flex gap-2">
              <button
                onClick={() => onEdit?.(sweet)}
                className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors duration-200 font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete?.(sweet.id)}
                className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors duration-200 font-medium"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Quick stats */}
        <div className="flex justify-center items-center gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-xs text-gray-500">Preparation</div>
            <div className="text-sm font-semibold text-purple-600">5-10 min</div>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div className="text-center">
            <div className="text-xs text-gray-500">Freshness</div>
            <div className="text-sm font-semibold text-green-600">Daily</div>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          <div className="text-center">
            <div className="text-xs text-gray-500">Quality</div>
            <div className="text-sm font-semibold text-yellow-600">Premium</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SweetCard;