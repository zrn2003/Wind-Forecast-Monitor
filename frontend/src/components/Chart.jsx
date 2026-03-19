import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import dayjs from "dayjs";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // Filter out duplicates
    const uniquePayload = payload.reduce((acc, current) => {
      if (!acc.find(item => item.name === current.name)) return acc.concat([current]);
      return acc;
    }, []);

    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 border border-slate-200 rounded-xl shadow-xl">
        <p className="text-slate-500 text-xs font-semibold mb-3 pb-2 border-b border-slate-100 uppercase tracking-wider">
          {dayjs(label).format("DD MMM YYYY • HH:mm [UTC]")}
        </p>
        <div className="flex flex-col gap-3">
          {uniquePayload.map((entry, index) => (
            entry.name !== "bg" && (
              <div key={index} className="flex justify-between items-center gap-8">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.3)]" style={{ backgroundColor: entry.color, shadowColor: entry.color }}></span>
                  <span className="text-sm text-slate-600 font-medium">{entry.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-900 tracking-tight">
                  {entry.value?.toLocaleString()} <span className="text-xs text-slate-400 font-normal">MW</span>
                </span>
              </div>
            )
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function Chart({ actuals, forecasts }) {
  const timeMap = {};
  actuals.forEach(({ time, value }) => {
    const key = dayjs(time).valueOf();
    timeMap[key] = { ...timeMap[key], time: key, actual: value };
  });
  forecasts.forEach(({ time, value }) => {
    const key = dayjs(time).valueOf();
    timeMap[key] = { ...timeMap[key], time: key, forecast: value };
  });
  const chartData = Object.values(timeMap).sort((a, b) => a.time - b.time);

  return (
    <div className="w-full h-[500px] flex flex-col pt-2">
      <div className="flex items-center gap-2 mb-6 px-4">
        <div className="w-1.5 h-5 bg-gradient-to-b from-blue-500 to-cyan-400 rounded-full"></div>
        <h3 className="text-lg font-bold text-slate-800">Generation Trajectories</h3>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
          <defs>
            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
          <XAxis 
            dataKey="time" 
            type="number" 
            scale="time"
            domain={["dataMin", "dataMax"]}
            tickFormatter={v => dayjs(v).format("DD/MM HH:mm")}
            stroke="#cbd5e1"
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
            tickMargin={12}
            tickLine={false}
          />
          <YAxis 
            tickFormatter={v => `${(v / 1000).toFixed(0)}k`}
            stroke="#cbd5e1"
            tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
            tickMargin={8}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            height={40} 
            iconType="circle"
            wrapperStyle={{ fontSize: '14px', fontWeight: 600, color: '#475569', paddingBottom: '20px' }}
          />
          
          <Area 
            type="monotone" 
            dataKey="actual" 
            stroke="none" 
            fillOpacity={1} 
            fill="url(#colorActual)" 
            name="bg" 
            legendType="none"
            tooltipType="none"
            activeDot={false}
            isAnimationActive={false}
          />
          
          <Line 
            connectNulls={true}
            type="monotone" 
            dataKey="actual" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={false}
            name="Actual Generation" 
            activeDot={{ r: 7, strokeWidth: 0, fill: '#3b82f6' }}
            style={{ filter: "drop-shadow(0px 4px 6px rgba(59, 130, 246, 0.2))" }}
          />
          <Line 
            connectNulls={true}
            type="monotone" 
            dataKey="forecast" 
            stroke="#10b981" 
            strokeWidth={3}
            strokeDasharray="8 6"
            dot={false}
            name="Forecast Target" 
            activeDot={{ r: 7, strokeWidth: 0, fill: '#10b981' }}
            style={{ filter: "drop-shadow(0px 4px 6px rgba(16, 185, 129, 0.2))" }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
