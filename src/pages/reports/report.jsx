import React, { useState } from 'react';
import { ChevronDown, TrendingUp, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('Hiring Summary');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const views = ['Hiring Summary', 'Applicants per Job', 'Hiring Performance', 'Time-To-Fill Metrics'];

  const contentData = {
    'Hiring Summary': {
      kpis: [
        { label: 'Total Job Postings', value: '247', trend: '4% higher than last month' },
        { label: 'Total Applicants', value: '1,834', trend: '12% higher than last month' },
        { label: 'Hired Candidates', value: '156', trend: '5% higher than last month' },
        { label: 'Success Rate', value: '8.5%', trend: '2% higher than last month' },
      ],
      component: <BarChartSection title="Job Post per Barangay" />
    },
    'Applicants per Job': {
      kpis: [
        { label: 'Average Applicants per Job', value: '7.5', trend: '0.5 from last week' },
        { label: 'Most Applied Position', value: '24', trend: 'Software Developer' },
        { label: 'Active Job Postings', value: '84', trend: '2% from last week' },
        { label: 'Jobs with no Applicants', value: '12', trend: '1% higher than last week' },
      ],
      component: <ApplicantDistribution />
    },
    'Hiring Performance': {
      kpis: [
        { label: 'Average Time to Hire', value: '18.5', trend: '2% higher than last month' },
        { label: 'Interview Conversion', value: '32%', trend: '5% from last month' },
        { label: 'Offer Acceptance Rate', value: '87%', trend: '4% from last month' },
        { label: 'Application Drop-off', value: '24%', trend: '1% from last month' },
      ],
      component: <EngagementTable />
    },
    'Time-To-Fill Metrics': {
      kpis: [
        { label: 'Total Job Postings', value: '247', trend: '4% higher than last month' },
        { label: 'Total Applicants', value: '1,834', trend: '12% higher than last month' },
        { label: 'Hired Candidates', value: '156', trend: '5% higher than last month' },
        { label: 'Success Rate', value: '8.5%', trend: '2% higher than last month' },
      ],
      component: <TimeToFillFullView />
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      {/* Top Header Section - Using bg-brand-dark */}
      <div className="bg-brand-dark text-white rounded-t-2xl p-5 shadow-xl relative">
        <h1 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
          <BarChart3 size={24} /> Report & Insights
        </h1>
        <div 
          className="bg-[#2b3a55] p-3 rounded-lg flex justify-between items-center cursor-pointer border border-white/10 backdrop-blur-sm"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="font-light">{activeView}</span>
          <ChevronDown className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </div>
        
        {isDropdownOpen && (
          <div className="absolute left-5 right-5 mt-2 bg-brand-dark text-white rounded-xl shadow-2xl z-50 border border-brand-yellow/20 overflow-hidden">
            {views.map((view) => (
              <div 
                key={view}
                className={`p-4 cursor-pointer transition-colors border-b border-white/5 last:border-0 ${activeView === view ? 'bg-[#2b3a55] text-brand-yellow font-bold' : 'font-light hover:bg-white/5'}`}
                onClick={() => { setActiveView(view); setIsDropdownOpen(false); }}
              >
                {view}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Content Body */}
      <div className="bg-white rounded-b-2xl shadow-xl border-x border-b border-slate-200 p-8">
        <h2 className="text-3xl font-extrabold text-slate-800 mb-8">{activeView}</h2>

        {/* Filters - Using bg-brand-dark and text-brand-yellow */}
        <div className="bg-brand-dark p-6 rounded-2xl flex flex-wrap gap-6 items-end mb-10 shadow-lg">
          <div className="flex-1 min-w-[250px]">
            <label className="text-brand-yellow text-[11px] uppercase tracking-widest font-black mb-3 block">Range Date</label>
            <div className="flex items-center gap-3">
              <input type="text" value="02/13/2026" readOnly className="w-full bg-[#2a3449] border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none" />
              <span className="text-brand-yellow font-bold">To</span>
              <input type="text" value="02/13/2026" readOnly className="w-full bg-[#2a3449] border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none" />
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="text-brand-yellow text-[11px] uppercase tracking-widest font-black mb-3 block">Barangay</label>
            <select className="w-full bg-[#2a3449] border border-white/10 rounded-lg px-4 py-2 text-white text-sm appearance-none cursor-pointer focus:outline-none">
              <option className="text-slate-800">Any</option>
            </select>
          </div>
          <button className="bg-gray-200 text-slate-800 px-8 py-2 rounded-lg text-sm font-bold hover:bg-gray-300 transition-all shadow-md">
            Clear Filters
          </button>
        </div>

        {/* KPI Grid - Using bg-brand-dark */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {contentData[activeView].kpis.map((stat, idx) => (
            <div key={idx} className="bg-brand-dark p-6 rounded-2xl text-white border border-white/5 shadow-md transform hover:-translate-y-1 transition-transform">
              <p className="text-xs text-gray-400 font-medium italic mb-2">{stat.label}</p>
              <p className="text-4xl font-black mb-3">{stat.value}</p>
              <div className="flex items-center gap-2 text-[10px] text-gray-400 bg-black/20 w-fit px-2 py-1 rounded-full">
                <TrendingUp size={12} />
                <span>{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Visualization Card Container */}
        <div className="bg-brand-dark rounded-3xl overflow-hidden shadow-2xl">
          <div className="h-4 w-full bg-black/20"></div>
          <div className="p-1 bg-white/5 backdrop-blur-sm">
            <div className="bg-[#fcfcfd] m-4 rounded-2xl p-8 border border-slate-100 shadow-inner">
              {contentData[activeView].component}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- View Components ---

const BarChartSection = ({ title }) => (
  <div className="space-y-8">
    <h3 className="text-xl font-bold text-slate-800">{title}</h3>
    <div className="h-64 flex items-end justify-between gap-6 border-b-2 border-slate-100 px-10">
      {[40, 85, 15, 30, 45].map((h, i) => (
        <div key={i} className="flex-1 max-w-[80px] group relative">
          <div className="w-full bg-[#415a77] rounded-t-lg transition-all duration-500 group-hover:bg-brand-yellow" style={{ height: `${h}%` }}></div>
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-400 whitespace-nowrap">Barangay {i+1}</span>
        </div>
      ))}
    </div>
    <div className="pt-10"><EngagementTable /></div>
  </div>
);

const ApplicantDistribution = () => (
  <div className="space-y-10">
    <div>
      <h3 className="text-2xl font-black text-slate-800">Applicant Distribution</h3>
      <p className="text-slate-500 text-sm">Registered job seekers per barangay</p>
    </div>
    <div className="space-y-8 max-w-3xl">
      {[
        { name: 'Addition Hills', val: '1,860', w: '90%', color: 'bg-cyan-400' },
        { name: 'Highway Hills', val: '1,190', w: '65%', color: 'bg-brand-yellow' },
        { name: 'Plainview', val: '730', w: '40%', color: 'bg-rose-500' },
        { name: 'Wack-Wack', val: '780', w: '45%', color: 'bg-rose-400' },
      ].map((item, i) => (
        <div key={i} className="flex items-center gap-6">
          <span className="w-32 text-sm font-bold text-slate-600">{item.name}</span>
          <div className="flex-1 bg-slate-100 h-8 rounded-lg overflow-hidden flex items-center shadow-inner">
            <div className={`${item.color} h-full transition-all duration-1000 shadow-lg`} style={{ width: item.w }}></div>
          </div>
          <span className="w-16 text-sm font-black text-slate-800 text-right">{item.val}</span>
        </div>
      ))}
    </div>
  </div>
);

const TimeToFillFullView = () => (
  <div className="space-y-10">
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
      <h3 className="font-bold text-slate-800 mb-6">Time-to-Fill Trend</h3>
      <div className="h-48 w-full bg-green-50 border-b-4 border-green-500 rounded-t-lg relative flex items-end overflow-hidden">
        <p className="absolute w-full text-center text-green-700 font-black text-lg top-1/2 -translate-y-1/2">DECREASING TREND VISUALIZATION</p>
      </div>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="p-6 bg-white border border-slate-100 rounded-xl text-center text-gray-400 italic">Category Chart</div>
      <div className="p-6 bg-white border border-slate-100 rounded-xl">
        <h4 className="text-xs font-black uppercase text-slate-400 mb-6">Fill Rate by Stage</h4>
        <div className="space-y-3">
          {['Posted', 'Applied', 'Screened', 'Interview', 'Offer'].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full" style={{width: `${100 - (i*15)}%`}}></div>
              </div>
              <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">{2 + i}.4 days</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div>
      <h4 className="font-bold text-slate-800 mb-4">Recent Filled Positions</h4>
      <div className="overflow-hidden rounded-xl border border-slate-100 shadow-sm">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-4 font-bold text-slate-600">Job Title</th>
              <th className="p-4 font-bold text-slate-600">Filled Date</th>
              <th className="p-4 font-bold text-slate-600">Performance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <tr className="bg-white">
              <td className="p-4 font-bold text-slate-700">Customer Service Rep</td>
              <td className="p-4 text-slate-500">Feb 5, 2026</td>
              <td className="p-4"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full uppercase font-black">Excellent</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const EngagementTable = () => (
  <div className="space-y-4">
    <h3 className="text-center font-bold text-slate-400 uppercase text-xs tracking-widest">Barangay Engagement</h3>
    <div className="overflow-hidden rounded-xl border border-slate-100 shadow-sm">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="p-4 text-brand-yellow font-black">Rank</th>
            <th className="p-4 text-brand-yellow font-black">Barangay Name</th>
            <th className="p-4 text-brand-yellow font-black text-center border-l border-slate-200">Session Counts</th>
            <th className="p-4 text-brand-yellow font-black text-center border-l border-slate-200">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {[1, 2, 3].map((r) => (
            <tr key={r} className="hover:bg-blue-50/50 transition-colors">
              <td className="p-4 font-bold text-slate-400">{r}</td>
              <td className="p-4 font-bold text-slate-700">Barangay Name</td>
              <td className="p-4 text-center border-l border-slate-100">42</td>
              <td className="p-4 text-center border-l border-slate-100">
                <span className="text-[10px] font-black px-3 py-1 rounded-full bg-green-100 text-green-700 uppercase">High</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default Dashboard;