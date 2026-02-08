
import React from 'react';
import { 
  ShieldAlert, 
  BarChart3, 
  Users, 
  Database, 
  Globe, 
  Settings,
  ArrowUpRight,
  Power
} from 'lucide-react';

const AdminPanel: React.FC = () => {
  const stats = [
    { label: 'Total Downloads', value: '14,293', change: '+12%', icon: <BarChart3 className="text-blue-500" /> },
    { label: 'Active Users', value: '1,102', change: '+5%', icon: <Users className="text-purple-500" /> },
    { label: 'Storage Usage', value: '42.8 GB', change: '85%', icon: <Database className="text-amber-500" /> },
    { label: 'Avg Speed', value: '8.2 MB/s', change: 'Stable', icon: <ArrowUpRight className="text-green-500" /> }
  ];

  const platforms = [
    { name: 'YouTube', status: 'Active', load: 'Medium' },
    { name: 'TikTok', status: 'Active', load: 'High' },
    { name: 'Instagram', status: 'Maintenance', load: 'None' },
    { name: 'Twitter', status: 'Active', load: 'Low' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-24">
      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 bg-red-600 rounded-2xl text-white">
          <ShieldAlert size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold">Control Center</h1>
          <p className="text-gray-400">Manage infrastructure and monitor platform health.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-morphism p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-white/5 rounded-xl">{stat.icon}</div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.includes('+') ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-black text-white">{stat.value}</div>
            <div className="text-gray-500 text-sm font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Platform Status */}
        <div className="lg:col-span-2 glass-morphism rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Globe size={20} className="text-blue-500" />
              Platform Integrations
            </h2>
            <button className="text-sm font-bold text-blue-500 hover:text-blue-400">View All</button>
          </div>
          <div className="space-y-4">
            {platforms.map((p) => (
              <div key={p.name} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-2xl border border-gray-800">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center font-bold text-xs">
                    {p.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold">{p.name}</div>
                    <div className="text-xs text-gray-500">Current Load: {p.load}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full border ${p.status === 'Active' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                    {p.status}
                  </span>
                  <button className="p-2 text-gray-500 hover:text-white transition-colors">
                    <Power size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="glass-morphism rounded-3xl p-8 flex flex-col">
          <h2 className="text-xl font-bold flex items-center gap-2 mb-8">
            <Settings size={20} className="text-blue-500" />
            System Health
          </h2>
          <div className="space-y-6 flex-grow">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">CPU Usage</span>
                <span className="text-white font-bold">24%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '24%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Memory Usage</span>
                <span className="text-white font-bold">62%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '62%' }} />
              </div>
            </div>
            <div className="pt-6 border-t border-gray-800 mt-auto">
              <button className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-colors">
                Clear Storage Cache
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
