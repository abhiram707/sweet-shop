import React, { useState, useEffect } from 'react';
import { X, Save, Plus, ImageIcon } from 'lucide-react';
import { Sweet } from '../../types';
import { useApi } from '../../hooks/useApi';

// Suggested images for different categories
const suggestedImages = {
  'Cookies': [
    'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&auto=format&fit=crop'
  ],
  'Cupcakes': [
    'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&auto=format&fit=crop'
  ],
  'Chocolate': [
    'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1549042256-0e9c4b0d9e3f?w=400&auto=format&fit=crop'
  ],
  'Gummies': [
    'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571506165871-ee72905b3bb3?w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1575908539629-0b1b4d6ed1f9?w=400&auto=format&fit=crop'
  ],
  'Macarons': [
    'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1612201142855-da9e8d12b53f?w=400&auto=format&fit=crop'
  ],
  'Lollipops': [
    'https://images.unsplash.com/photo-1603893603637-80ac0bd48b64?w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571506165871-ee72905b3bb3?w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=400&auto=format&fit=crop'
  ],
  'Sour Candy': [
    'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1575908539629-0b1b4d6ed1f9?w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&auto=format&fit=crop'
  ],
  'Brownies': [
    'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&auto=format&fit=crop'
  ],
  'Cakes': [
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format&fit=crop'
  ],
  'Donuts': [
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&auto=format&fit=crop'
  ],
  'Cotton Candy': [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1575908539629-0b1b4d6ed1f9?w=400&auto=format&fit=crop'
  ],
  'Pastries': [
    'https://images.unsplash.com/photo-1586985289906-406426bdac50?w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=400&auto=format&fit=crop'
  ],
  'Jellies': [
    'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571506165871-ee72905b3bb3?w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1575908539629-0b1b4d6ed1f9?w=400&auto=format&fit=crop'
  ],
  'Mousse': [
    'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&auto=format&fit=crop'
  ],
  'Cake Pops': [
    'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&auto=format&fit=crop'
  ]
};

interface SweetFormProps {
  sweet?: Sweet;
  onClose: () => void;
  onSuccess: () => void;
}

const SweetForm: React.FC<SweetFormProps> = ({ sweet, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    description: '',
    image_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { apiCall } = useApi();

  useEffect(() => {
    if (sweet) {
      setFormData({
        name: sweet.name,
        category: sweet.category,
        price: sweet.price.toString(),
        quantity: sweet.quantity.toString(),
        description: sweet.description || '',
        image_url: sweet.image_url || '',
      });
    }
  }, [sweet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
      };

      if (sweet) {
        await apiCall(`/api/sweets/${sweet.id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
      } else {
        await apiCall('/api/sweets', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const categories = ['Chocolate', 'Candy', 'Gummies', 'Lollipops', 'Fudge', 'Cookies', 'Other'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {sweet ? 'Edit Sweet' : 'Add New Sweet'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Sweet Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter sweet name"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity *
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                required
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
            
            {/* Image Preview */}
            {formData.image_url && (
              <div className="mt-2">
                <div className="text-sm text-gray-600 mb-1">Preview:</div>
                <img 
                  src={formData.image_url} 
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-lg border"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            {/* Suggested Images */}
            {formData.category && suggestedImages[formData.category as keyof typeof suggestedImages] && (
              <div className="mt-2">
                <div className="text-sm text-gray-600 mb-2">Suggested images for {formData.category}:</div>
                <div className="grid grid-cols-3 gap-2">
                  {suggestedImages[formData.category as keyof typeof suggestedImages].map((imageUrl, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image_url: imageUrl }))}
                      className="relative group cursor-pointer"
                    >
                      <img 
                        src={imageUrl} 
                        alt={`Suggested ${formData.category} image ${index + 1}`}
                        className="w-full h-16 object-cover rounded-lg border hover:ring-2 hover:ring-purple-500 transition-all"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all flex items-center justify-center">
                        <ImageIcon className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter description..."
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  {sweet ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  <span>{sweet ? 'Update' : 'Create'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SweetForm;