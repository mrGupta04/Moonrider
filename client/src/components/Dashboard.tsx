import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, ComposedChart
} from 'recharts';
import type { User } from '../types';

interface DashboardProps {
  user: User;
  onLogout: () => void;
  onProfileUpdate: (updatedUser: User) => void;
}

// Enhanced sample data for our charts
const monthlyRevenueData = [
  { month: 'Jan', revenue: 8200, expenses: 4200, profit: 4000, users: 1200 },
  { month: 'Feb', revenue: 7300, expenses: 4300, profit: 3000, users: 1450 },
  { month: 'Mar', revenue: 12500, expenses: 5200, profit: 7300, users: 1820 },
  { month: 'Apr', revenue: 9800, expenses: 4800, profit: 5000, users: 2100 },
  { month: 'May', revenue: 11500, expenses: 5200, profit: 6300, users: 2450 },
  { month: 'Jun', revenue: 14200, expenses: 6200, profit: 8000, users: 2850 },
  { month: 'Jul', revenue: 16300, expenses: 7300, profit: 9000, users: 3250 },
  { month: 'Aug', revenue: 18900, expenses: 7900, profit: 11000, users: 3820 },
  { month: 'Sep', revenue: 17500, expenses: 8200, profit: 9300, users: 4120 },
  { month: 'Oct', revenue: 19200, expenses: 8800, profit: 10400, users: 4520 },
  { month: 'Nov', revenue: 21500, expenses: 9200, profit: 12300, users: 4950 },
  { month: 'Dec', revenue: 23800, expenses: 9800, profit: 14000, users: 5320 },
];

const performanceData = [
  { subject: 'Sales', current: 120, previous: 95 },
  { subject: 'Marketing', current: 98, previous: 85 },
  { subject: 'Development', current: 86, previous: 78 },
  { subject: 'Support', current: 99, previous: 92 },
  { subject: 'Research', current: 85, previous: 70 },
  { subject: 'Finance', current: 92, previous: 80 },
];

const categoryData = [
  { name: 'Electronics', value: 35, color: '#0088FE' },
  { name: 'Fashion', value: 25, color: '#00C49F' },
  { name: 'Home & Kitchen', value: 20, color: '#FFBB28' },
  { name: 'Books', value: 10, color: '#FF8042' },
  { name: 'Beauty', value: 10, color: '#8884D8' },
];

const trafficData = [
  { source: 'Direct', visitors: 4000, conversion: 12 },
  { source: 'Social', visitors: 3000, conversion: 8 },
  { source: 'Referral', visitors: 2000, conversion: 10 },
  { source: 'Organic', visitors: 2780, conversion: 15 },
  { source: 'Email', visitors: 1890, conversion: 20 },
  { source: 'Paid Ads', visitors: 2390, conversion: 6 },
];

const topProducts = [
  { id: 1, name: 'Wireless Headphones', price: 199.99, sales: 1245, stock: 45 },
  { id: 2, name: 'Smart Watch', price: 249.99, sales: 985, stock: 12 },
  { id: 3, name: 'Fitness Tracker', price: 79.99, sales: 1520, stock: 78 },
  { id: 4, name: 'Bluetooth Speaker', price: 129.99, sales: 875, stock: 32 },
  { id: 5, name: 'Gaming Mouse', price: 59.99, sales: 1120, stock: 56 },
];

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout, onProfileUpdate }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState('last30days');

  // Stats cards data
  const statsData = [
    {
      title: 'Total Revenue',
      value: '$142.8k',
      change: '+12.4%',
      isPositive: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: 'New Customers',
      value: '1,240',
      change: '+8.2%',
      isPositive: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      title: 'Conversion Rate',
      value: '4.8%',
      change: '-1.2%',
      isPositive: false,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: 'Avg. Order Value',
      value: '$112.64',
      change: '+3.6%',
      isPositive: true,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    }
  ];

  // Render different content based on activeTab
  const renderMainContent = () => {
    switch (activeTab) {
      case 'analytics':
        return <div className="p-6 bg-white rounded-xl shadow-sm">Analytics View</div>;
      case 'customers':
        return <div className="p-6 bg-white rounded-xl shadow-sm">Customers View</div>;
      case 'dashboard':
      default:
        return (
          <>
            {/* Header with date filter */}
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
              <div className="flex space-x-2">
                <select 
                  className="bg-white border border-gray-300 rounded-lg py-2 px-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="last7days">Last 7 days</option>
                  <option value="last30days">Last 30 days</option>
                  <option value="last90days">Last 90 days</option>
                  <option value="thisYear">This Year</option>
                </select>
              </div>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsData.map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                      <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
                      <div className={`flex items-center mt-2 ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.isPositive ? (
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        )}
                        <span className="text-sm font-medium">{stat.change}</span>
                        <span className="text-sm text-gray-500 ml-1">vs previous period</span>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg">
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Revenue vs Expenses Composed Chart */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Revenue & Profit Analysis</h3>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Revenue</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Profit</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Expenses</span>
                  </div>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={monthlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" name="Revenue" />
                    <Bar yAxisId="left" dataKey="expenses" fill="#ff4d4f" name="Expenses" />
                    <Line yAxisId="right" type="monotone" dataKey="profit" stroke="#00C49F" strokeWidth={2} name="Profit" dot={{ r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Performance Radar Chart */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Department Performance</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData}>
                      <PolarGrid stroke="#eee" />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 150]} />
                      <Radar name="Current" dataKey="current" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Radar name="Previous" dataKey="previous" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Sales Distribution Pie Chart */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Sales by Category</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Traffic Sources Chart */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Traffic Sources</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trafficData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis dataKey="source" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="visitors" fill="#8884d8" name="Visitors" />
                      <Line yAxisId="right" type="monotone" dataKey="conversion" stroke="#ff7300" name="Conversion %" strokeWidth={2} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* User Growth Area Chart */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">User Growth & Revenue</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Area yAxisId="left" type="monotone" dataKey="users" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} name="Users" />
                      <Area yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.2} name="Revenue" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Top Products Table */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Top Selling Products</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {topProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                              </svg>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${product.price}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{product.sales.toLocaleString()}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock > 20 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {product.stock > 20 ? 'In Stock' : 'Low Stock'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 overflow-auto">
        <Header 
          user={user} 
          onLogout={onLogout} 
          activeTab={activeTab} 
          onProfileUpdate={onProfileUpdate} 
        />
        
        <main className="p-6">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;