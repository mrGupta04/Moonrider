// StatsCards.tsx
import React from 'react';

const StatsCards: React.FC = () => {
  const stats = [
    {
      title: 'Total Balance',
      value: '$24,562.00',
      change: '+12.5%',
      trend: 'up',
      icon: '💰',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      borderColor: 'border-l-blue-500'
    },
    {
      title: 'Monthly Revenue',
      value: '$12,458.00',
      change: '+15.2%',
      trend: 'up',
      icon: '📈',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      borderColor: 'border-l-green-500'
    },
    {
      title: 'Monthly Expenses',
      value: '$8,342.00',
      change: '+8.7%',
      trend: 'up',
      icon: '📉',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      borderColor: 'border-l-red-500'
    },
    {
      title: 'Investment Value',
      value: '$45,789.00',
      change: '+5.3%',
      trend: 'up',
      icon: '💎',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      borderColor: 'border-l-purple-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className={`bg-white rounded-2xl shadow-sm p-6 border-l-4 ${stat.borderColor}`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              <p className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'} mt-2`}>
                {stat.change} from last month
              </p>
            </div>
            <div className={`p-3 rounded-full ${stat.bgColor}`}>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;