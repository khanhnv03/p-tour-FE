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
  Legend
} from 'recharts';

const barData = [
  { name: 'Trực tiếp', visitors: 4000 },
  { name: 'Tự nhiên', visitors: 3000 },
  { name: 'Giới thiệu', visitors: 2000 },
  { name: 'Mạng xã hội', visitors: 2780 },
];

const pieData = [
  { name: 'Máy tính', value: 400 },
  { name: 'Di động', value: 300 },
  { name: 'Máy tính bảng', value: 300 },
];
const COLORS = ['#004e9f', '#fe6a34', '#af4900'];

export default function Analytics() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">
      {/* Editorial Header */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <nav className="flex items-center space-x-2 text-on-surface-variant text-[9px] font-black uppercase tracking-[0.2em] mb-3">
            <span>Dữ liệu chiến lược</span>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-primary italic">Thông tin Thị trường</span>
          </nav>
          <h1 className="text-3xl font-black text-on-surface tracking-tight leading-none">Trung tâm Phân tích</h1>
          <p className="text-slate-400 text-sm leading-relaxed font-medium mt-2">
            Giải mã hành động của khách hàng và tối ưu hóa chuyển đổi trải nghiệm.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-surface-container-high px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest text-on-surface flex items-center gap-2 hover:bg-primary hover:text-white transition-all active:scale-95 border border-surface-container-high shadow-sm">
            <span className="material-symbols-outlined text-sm">download</span>
            Kết xuất Dữ liệu
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Chart Section */}
        <div className="lg:col-span-8 bg-surface-container-lowest p-8 rounded-3xl border border-surface-container-low shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-base font-black text-on-surface tracking-tight">Cấu trúc Lưu lượng</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Phân tích nguồn gốc người thám hiểm</p>
            </div>
            <div className="bg-surface-container-low p-1 rounded-xl flex gap-1">
              <button className="px-4 py-1.5 rounded-lg bg-white text-[10px] font-black uppercase tracking-widest text-primary shadow-sm">Tháng</button>
              <button className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/50 transition-colors">Quý</button>
            </div>
          </div>
          
          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900, textTransform: 'uppercase' }} 
                  dy={15} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900 }} 
                  width={80} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }} 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: '1px solid #f1f5f9', 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    padding: '12px 16px',
                  }} 
                  labelStyle={{ fontWeight: '900', color: '#0f172a', fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px' }}
                />
                <Bar 
                  dataKey="visitors" 
                  fill="url(#barGradient)" 
                  radius={[8, 8, 0, 0]} 
                  barSize={40}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#004e9f" />
                    <stop offset="100%" stopColor="#fe6a34" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Usage Chart Section */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-surface-container-lowest p-8 rounded-3xl border border-surface-container-low shadow-sm flex-grow">
            <h2 className="text-base font-black text-on-surface tracking-tight mb-8">Hệ sinh thái Thiết bị</h2>
            <div className="h-[220px] flex justify-center mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={6}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      backgroundColor: '#1e293b',
                      color: 'white',
                      boxShadow: '0 10px 15px rgba(0,0,0,0.1)'
                    }}
                    itemStyle={{ color: 'white', fontSize: '10px', fontWeight: 'bold' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest pl-1">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="signature-gradient text-white p-6 rounded-3xl shadow-xl shadow-primary/10 relative overflow-hidden group border border-primary/20">
            <div className="relative z-10">
              <h3 className="text-sm font-black uppercase tracking-widest mb-2 italic">Nhịp đập số</h3>
              <p className="text-[11px] font-medium leading-relaxed mb-6 opacity-90">Sự gắn kết của người dùng tăng 14% nhờ tối ưu trải nghiệm di động.</p>
              <button className="bg-white text-primary px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-md hover:bg-slate-50">Chi tiết</button>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
              <span className="material-symbols-outlined text-[80px]" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Chuyển đổi', value: '3.4%', change: '+0.5', icon: 'ads_click' },
          { label: 'Tỷ lệ thoát', value: '42%', change: '-2.1', icon: 'leak_remove' },
          { label: 'Thời gian TB', value: '12m 4s', change: '+1m', icon: 'timer' },
          { label: 'Lượt xem trang', value: '1.2M', change: '+140k', icon: 'visibility' }
        ].map((stat, i) => (
          <div key={i} className="bg-surface-container-lowest p-6 rounded-2xl border border-surface-container-low shadow-sm flex flex-col group hover:border-primary/20 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-base opacity-60">{stat.icon}</span>
              </div>
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                {stat.change}
              </span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{stat.label}</span>
            <span className="text-xl font-black text-on-surface tracking-tight">{stat.value}</span>
          </div>
        ))}
      </section>
    </div>
  );
}
