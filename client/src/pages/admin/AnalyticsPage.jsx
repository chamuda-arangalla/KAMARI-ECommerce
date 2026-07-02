import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { mockAnalytics } from '../../data/adminMockData';
import { TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react';

const COLORS = ['#d4a373', '#c2b2a6', '#d7c9b8', '#f3ede8'];

const StatCard = ({ icon: Icon, label, value, trend }) => (
  <div className="bg-white p-5 sm:p-7 rounded-2xl border border-[#d7c9b8] shadow-sm">
    <div className="flex items-center justify-between mb-4 sm:mb-5">
      <div className="p-3 bg-[#fcfaf7] rounded-xl text-[#2c2b28]">
        <Icon size={24} className="sm:h-7 sm:w-7" />
      </div>
      <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
        {trend}
      </span>
    </div>
    <p className="text-base text-[#8f8376] font-medium">{label}</p>
    <p className="text-2xl sm:text-3xl font-bold text-[#2c2b28] mt-1">{value}</p>
  </div>
);

const AnalyticsPage = () => (
  <div className="space-y-6 sm:space-y-8">
    <div>
      <h2 className="text-2xl sm:text-4xl font-bold text-[#2c2b28]">Analytics</h2>
      <p className="text-base text-[#8f8376] mt-2">Performance insights and business growth</p>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
      <StatCard icon={DollarSign}  label="Total Revenue"    value="Rs 42,850" trend="+12.5%" />
      <StatCard icon={ShoppingCart}label="Total Orders"     value="384"         trend="+8.2%"  />
      <StatCard icon={Users}       label="New Customers"    value="52"          trend="+15.1%" />
      <StatCard icon={TrendingUp}  label="Avg. Order Value" value="Rs 112"    trend="-2.4%"  />
    </div>

    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-8">
      {/* Revenue */}
      <div className="bg-white p-5 sm:p-8 rounded-2xl border border-[#d7c9b8] shadow-sm">
        <h3 className="text-lg sm:text-xl font-bold text-[#2c2b28] mb-6 sm:mb-8">Revenue Overview</h3>
        <div className="h-64 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockAnalytics.revenueData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#d4a373" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#d4a373" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3ede8" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8f8376', fontSize: 14 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8f8376', fontSize: 14 }} />
              <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #d7c9b8', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontSize: 14 }} />
              <Area type="monotone" dataKey="revenue" stroke="#d4a373" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Best Sellers */}
      <div className="bg-white p-5 sm:p-8 rounded-2xl border border-[#d7c9b8] shadow-sm">
        <h3 className="text-lg sm:text-xl font-bold text-[#2c2b28] mb-6 sm:mb-8">Best Selling Products</h3>
        <div className="h-64 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockAnalytics.bestSellers} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3ede8" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#2c2b28', fontSize: 14 }} width={130} />
              <Tooltip cursor={{ fill: '#fcfaf7' }} contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #d7c9b8', fontSize: 14 }} />
              <Bar dataKey="sales" fill="#c2b2a6" radius={[0, 4, 4, 0]} barSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Order Distribution */}
      <div className="bg-white p-5 sm:p-8 rounded-2xl border border-[#d7c9b8] shadow-sm">
        <h3 className="text-lg sm:text-xl font-bold text-[#2c2b28] mb-6 sm:mb-8">Order Distribution</h3>
        <div className="h-64 sm:h-80 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={mockAnalytics.statusBreakdown} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={8} dataKey="value">
                {mockAnalytics.statusBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 14 }} />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: 14 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regional Sales */}
      <div className="bg-white p-5 sm:p-8 rounded-2xl border border-[#d7c9b8] shadow-sm">
        <h3 className="text-lg sm:text-xl font-bold text-[#2c2b28] mb-6 sm:mb-8">Regional Sales</h3>
        <div className="space-y-5 sm:space-y-6">
          {[
            { region: 'United Kingdom', value: '42%', color: 'bg-[#d4a373]' },
            { region: 'United States',  value: '28%', color: 'bg-[#c2b2a6]' },
            { region: 'Europe',         value: '18%', color: 'bg-[#d7c9b8]'  },
            { region: 'Asia Pacific',   value: '12%', color: 'bg-[#f3ede8]'  },
          ].map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between text-base">
                <span className="text-[#5f564d] font-medium">{item.region}</span>
                <span className="text-[#2c2b28] font-bold">{item.value}</span>
              </div>
              <div className="h-2.5 w-full bg-[#eae0d6] rounded-full overflow-hidden">
                <div className={`h-full ${item.color}`} style={{ width: item.value }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default AnalyticsPage;
