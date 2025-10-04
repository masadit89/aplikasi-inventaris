import React from 'react';
import { useInventory } from '../context/InventoryContext';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Category, ItemStatus } from '../types';

const COLORS_CATEGORY = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const COLORS_STATUS = ['#4CAF50', '#FFC107', '#F44336', '#2196F3', '#9E9E9E'];

// FIX: Replaced JSX.Element with React.ReactElement to resolve namespace issue.
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactElement; color: string }> = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-md flex items-center transition-transform hover:scale-105">
    <div className={`p-4 rounded-full ${color}`}>
      {icon}
    </div>
    <div className="ml-4">
      <p className="text-sm text-slate-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  const { items, loading } = useInventory();

  if (loading) {
    return <div className="text-center p-10">Memuat data dashboard...</div>;
  }

  const totalValue = items.reduce((acc, item) => acc + item.price, 0).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
  
  const itemsByCategory = Object.values(Category).map(cat => ({
    name: cat,
    value: items.filter(item => item.category === cat).length
  })).filter(c => c.value > 0);

  const itemsByStatus = Object.values(ItemStatus).map(stat => ({
    name: stat,
    value: items.filter(item => item.status === stat).length
  })).filter(s => s.value > 0);


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-800">Dashboard Inventaris</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Aset" value={items.length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>} color="bg-blue-500" />
        <StatCard title="Total Nilai Aset" value={totalValue} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 14v1m0-1v-.01m0-4.01V10m0 4.01V14m0 0v.01M12 8a2 2 0 100-4 2 2 0 000 4zm0 12a2 2 0 100-4 2 2 0 000 4z" /></svg>} color="bg-green-500" />
        <StatCard title="Perlu Perbaikan" value={items.filter(i => i.status === ItemStatus.PERLU_PERBAIKAN).length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.834 9.168-4.432l.256-.512a1.76 1.76 0 013.417.592l-2.147 6.15M16 18h-2.582A4.002 4.002 0 017 14.168V13" /></svg>} color="bg-red-500" />
        <StatCard title="Sedang Dipinjam" value={items.filter(i => i.status === ItemStatus.DIPINJAM).length} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>} color="bg-yellow-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Aset Berdasarkan Kategori</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={itemsByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                {itemsByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS_CATEGORY[index % COLORS_CATEGORY.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} item`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Aset Berdasarkan Status</h3>
           <ResponsiveContainer width="100%" height={300}>
            <BarChart data={itemsByStatus} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value">
                {itemsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_STATUS[index % COLORS_STATUS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};