import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Sweet } from '../../types';
import { useApi } from '../../hooks/useApi';

interface RestockModalProps {
  sweet: Sweet;
  onClose: () => void;
  onSuccess: () => void;
}

const RestockModal: React.FC<RestockModalProps> = ({ sweet, onClose, onSuccess }) => {
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { apiCall } = useApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const restockQuantity = parseInt(quantity);
    if (restockQuantity <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await apiCall(`/api/sweets/${sweet.id}/restock`, {
        method: 'POST',
        body: JSON.stringify({ quantity: restockQuantity }),
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Restock failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Restock Sweet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h3 className="font-medium text-gray-900">{sweet.name}</h3>
            <p className="text-sm text-gray-600">
              Current stock: <span className="font-medium">{sweet.quantity} units</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity to Add
              </label>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter quantity to add"
                required
              />
            </div>

            {quantity && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-sm text-green-800">
                  New stock will be: <span className="font-medium">{sweet.quantity + parseInt(quantity || '0')} units</span>
                </p>
              </div>
            )}

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
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Restock</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RestockModal;