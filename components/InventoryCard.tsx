
import React from 'react';
import { Product } from '../types';

interface InventoryCardProps {
  product: Product;
  stock: number;
  onStockChange: (id: string, newStock: number) => void;
  orderQuantity: number;
  onOrderChange: (id: string, newQuantity: number) => void;
}

const InventoryCard: React.FC<InventoryCardProps> = ({ 
  product, 
  stock, 
  onStockChange,
  orderQuantity,
  onOrderChange
}) => {
  const isLowStock = stock < 5;

  const handleInputStock = (val: string) => {
    const num = parseInt(val);
    onStockChange(product.id, isNaN(num) ? 0 : num);
  };

  const handleInputOrder = (val: string) => {
    const num = parseInt(val);
    onOrderChange(product.id, isNaN(num) ? 0 : num);
  };

  return (
    <div className={`bg-white p-3 rounded-2xl border transition-all duration-300 group ${
      isLowStock 
      ? 'border-red-100 bg-red-50/10' 
      : 'border-gray-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10'
    }`}>
      <div className="flex justify-between items-start mb-2">
        <div className="min-w-0 pr-2">
          <h4 className="text-xs font-bold text-gray-800 leading-tight mb-0.5 group-hover:text-blue-700 transition-colors line-clamp-2" title={product.name}>
            {product.name}
          </h4>
          <span className="inline-block px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[9px] font-bold uppercase tracking-tight rounded">
            {product.category}
          </span>
        </div>
        <div className={`flex flex-col items-end shrink-0`}>
          <span className={`text-[9px] font-bold uppercase mb-0.5 ${isLowStock ? 'text-red-500' : 'text-gray-400'}`}>Stock</span>
          <div className={`text-xs font-black px-2 py-0.5 rounded-lg shadow-sm ${
            isLowStock ? 'bg-red-500 text-white' : 'bg-gray-800 text-white'
          }`}>
            {stock}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-0.5 relative">
          <label className="block text-[9px] text-gray-400 font-bold uppercase tracking-tight">Stock Actual</label>
          <input
            type="number"
            min="0"
            value={stock === 0 ? '' : stock}
            placeholder="0"
            onChange={(e) => handleInputStock(e.target.value)}
            className="w-full text-center text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl py-1.5 focus:bg-white focus:border-blue-500 outline-none transition-all placeholder:text-gray-300 cursor-text caret-blue-500 pr-1"
          />
        </div>
        <div className="space-y-0.5 relative">
          <label className="block text-[9px] text-orange-400 font-bold uppercase tracking-tight">Pedir (+)</label>
          <input
            type="number"
            min="0"
            value={orderQuantity === 0 ? '' : orderQuantity}
            placeholder="0"
            onChange={(e) => handleInputOrder(e.target.value)}
            className={`w-full text-center text-xs font-black border rounded-xl py-1.5 outline-none transition-all cursor-text caret-orange-500 pr-1 ${
              orderQuantity > 0 
              ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-inner' 
              : 'border-gray-200 bg-gray-50 text-gray-300'
            } focus:border-orange-500 focus:bg-white`}
          />
        </div>
      </div>
    </div>
  );
};

export default InventoryCard;
