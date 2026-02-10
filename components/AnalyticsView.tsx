
import React from 'react';
import { RoadmapItem, RoadmapStatus, Priority } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { TrendingUp, Target, BarChart3, PieChart as PieIcon } from 'lucide-react';

interface AnalyticsViewProps {
  items: RoadmapItem[];
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ items }) => {
  const matrixData = items.map(item => ({
    name: item.title,
    effort: item.effort,
    value: item.value,
    priority: item.priority
  }));

  const statusData = Object.values(RoadmapStatus).map(status => ({
    name: status,
    value: items.filter(i => i.status === status).length
  })).filter(d => d.value > 0);

  const COLORS = ['#6366f1', '#fbbf24', '#10b981', '#94a3b8'];

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard 
          label="Total Strategic Items" 
          value={items.length} 
          subValue="+12% vs last cycle" 
          icon={Target} 
          color="bg-indigo-600" 
        />
        <StatCard 
          label="Execution Rate" 
          value={items.filter(i => i.status === RoadmapStatus.COMPLETED).length} 
          subValue="On-time delivery performance" 
          icon={TrendingUp} 
          color="bg-emerald-600" 
        />
        <StatCard 
          label="Active Development" 
          value={items.filter(i => i.status === RoadmapStatus.IN_DEVELOPMENT).length} 
          subValue="Resources currently allocated" 
          icon={BarChart3} 
          color="bg-amber-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-indigo-50 rounded-xl">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-black text-gray-900 tracking-tight">Strategic Priority Matrix</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  type="number" 
                  dataKey="effort" 
                  name="Effort" 
                  unit="/5" 
                  tick={{ fontSize: 10, fontWeight: 700 }}
                  label={{ value: 'Effort (Complexity)', position: 'insideBottom', offset: -10, fontSize: 10, fontWeight: 900 }} 
                />
                <YAxis 
                  type="number" 
                  dataKey="value" 
                  name="Value" 
                  unit="/5" 
                  tick={{ fontSize: 10, fontWeight: 700 }}
                  label={{ value: 'Business Value', angle: -90, position: 'insideLeft', fontSize: 10, fontWeight: 900 }} 
                />
                <ZAxis type="category" dataKey="name" name="Feature" />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }} 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 800 }}
                />
                <Scatter name="Roadmap Items" data={matrixData} fill="#6366f1">
                  {matrixData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value > 3 && entry.effort < 3 ? '#10b981' : '#6366f1'} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 flex justify-between text-[10px] uppercase font-black text-gray-400 tracking-widest">
            <span>Low Complexity</span>
            <span>High Complexity</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-indigo-50 rounded-xl">
              <PieIcon className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-black text-gray-900 tracking-tight">Development Velocity</h3>
          </div>
          <div className="h-[300px] w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-1/3 space-y-4">
              {statusData.map((item, index) => (
                <div key={item.name} className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.name}</span>
                  </div>
                  <span className="text-xl font-black text-gray-900 ml-4.5">{item.value} Items</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: number; subValue: string; icon: any; color: string }> = ({ label, value, subValue, icon: Icon, color }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-50/30 transition-colors"></div>
    <div className="flex justify-between items-start mb-6 relative z-10">
      <div className={`p-4 rounded-2xl ${color} text-white shadow-2xl shadow-gray-200 transition-transform group-hover:scale-110`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 relative z-10">{label}</h4>
    <div className="text-4xl font-black text-gray-900 mb-2 relative z-10 tracking-tight">{value}</div>
    <p className="text-[11px] text-emerald-600 font-extrabold relative z-10 tracking-wide">{subValue}</p>
  </div>
);

export default AnalyticsView;
