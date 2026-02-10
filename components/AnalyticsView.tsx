
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
import { useTranslation } from '../hooks/useTranslation';

interface AnalyticsViewProps {
  items: RoadmapItem[];
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ items }) => {
  const { t } = useTranslation();

  const matrixData = items.map(item => ({
    name: item.title,
    effort: item.effort,
    value: item.value,
    priority: item.priority
  }));

  const statusData = Object.values(RoadmapStatus).map(status => {
    let label = status;
    if (status === RoadmapStatus.BACKLOG) label = t('backlog');
    if (status === RoadmapStatus.PLANNING) label = t('planning');
    if (status === RoadmapStatus.IN_DEVELOPMENT) label = t('inDevelopment');
    if (status === RoadmapStatus.COMPLETED) label = t('completed');

    return {
      name: label,
      value: items.filter(i => i.status === status).length
    };
  }).filter(d => d.value > 0);

  const COLORS = ['#6366f1', '#fbbf24', '#10b981', '#94a3b8'];

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-16 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <StatCard
          label={t('totalItems')}
          value={items.length}
          subValue="+12% vs last cycle"
          icon={Target}
          color="bg-indigo-600"
        />
        <StatCard
          label={t('executionRate')}
          value={items.filter(i => i.status === RoadmapStatus.COMPLETED).length}
          subValue="On-time delivery performance"
          icon={TrendingUp}
          color="bg-emerald-600"
        />
        <StatCard
          label={t('activeDevelopment')}
          value={items.filter(i => i.status === RoadmapStatus.IN_DEVELOPMENT).length}
          subValue="Resources currently allocated"
          icon={BarChart3}
          color="bg-amber-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-indigo-50 rounded-2xl">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">{t('priorityMatrix')}</h3>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  dataKey="effort"
                  name={t('effort')}
                  unit="/5"
                  tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }}
                  label={{ value: t('effortComplexity'), position: 'insideBottom', offset: -15, fontSize: 11, fontWeight: 900, fill: '#64748b' }}
                />
                <YAxis
                  type="number"
                  dataKey="value"
                  name={t('value')}
                  unit="/5"
                  tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }}
                  label={{ value: t('businessValue'), angle: -90, position: 'insideLeft', offset: 10, fontSize: 11, fontWeight: 900, fill: '#64748b' }}
                />
                <ZAxis type="category" dataKey="name" name="Feature" />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  contentStyle={{ borderRadius: '1.5rem', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 800, padding: '15px' }}
                />
                <Scatter name="Roadmap Items" data={matrixData} fill="#6366f1">
                  {matrixData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value > 3 && entry.effort < 3 ? '#10b981' : '#6366f1'} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 flex justify-between text-[11px] uppercase font-black text-slate-400 tracking-[0.2em]">
            <span>{t('lowComplexity')}</span>
            <span>{t('highComplexity')}</span>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-indigo-50 rounded-2xl">
              <PieIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-display font-black text-slate-900 tracking-tight">{t('devVelocity')}</h3>
          </div>
          <div className="h-[350px] w-full flex items-center gap-8">
            <div className="flex-1 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={10}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity outline-none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-48 space-y-6">
              {statusData.map((item, index) => (
                <div key={item.name} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2.5">
                    <div className="h-3 w-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">{item.name}</span>
                  </div>
                  <span className="text-2xl font-black text-slate-900 ml-5.5">{item.value} <span className="text-xs text-slate-400 font-bold uppercase tracking-widest ml-1">Itens</span></span>
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
  <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
    <div className="absolute top-0 right-0 w-40 h-40 bg-slate-50 rounded-full -mr-20 -mt-20 group-hover:bg-indigo-50/50 transition-colors duration-700"></div>
    <div className="flex justify-between items-start mb-8 relative z-10">
      <div className={`p-5 rounded-[1.5rem] ${color} text-white shadow-2xl transition-all duration-700 group-hover:scale-110 group-hover:rotate-3`}>
        <Icon className="h-8 w-8" />
      </div>
    </div>
    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 relative z-10 leading-none">{label}</h4>
    <div className="text-5xl font-display font-black text-slate-900 mb-3 relative z-10 tracking-tight leading-none">{value}</div>
    <div className="flex items-center gap-2 relative z-10">
      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
      <p className="text-[12px] text-emerald-600 font-black tracking-wide">{subValue}</p>
    </div>
  </div>
);

export default AnalyticsView;
