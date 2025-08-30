// TopProducts.tsx
import React from 'react';

const TopProducts: React.FC = () => {
  const products = [
    { name: 'Tech Gadgets', sales: 234, revenue: '$12,345', growth: '+23%', color: 'bg-blue-500' },
    { name: 'Fashion', sales: 189, revenue: '$8,912', growth: '+15%', color: 'bg-pink-500' },
    { name: 'Home Decor', sales: 156, revenue: '$7,345', growth: '+12%', color: 'bg-green-500' },
    { name: 'Books', sales: 98, revenue: '$3,456', growth: '+8%', color: 'bg-yellow-500' },
    { name: 'Fitness', sales: 76, revenue: '$2,789', growth: '+5%', color: 'bg-purple-500' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Categories</h3>
      <div className="space-y-4">
        {products.map((product, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-3 h-3 ${product.color} rounded-full mr-3`}></div>
              <span className="font-medium">{product.name}</span>
            </div>
            <div className="text-right">
              <div className="font-semibold">{product.revenue}</div>
              <div className="text-sm text-gray-500">{product.sales} sales</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Revenue</span>
          <span className="font-bold text-lg text-gray-800">$34,847.00</span>
        </div>
      </div>
    </div>
  );
};

export default TopProducts;