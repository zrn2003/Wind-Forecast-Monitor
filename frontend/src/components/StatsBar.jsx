export default function StatsBar({ mae, rmse, latestActual, latestForecast }) {
  if (mae == null) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Latest Actual Card */}
      <div className="bg-white p-6 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col relative overflow-hidden group hover:border-blue-200 transition-colors">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full"></div>
        <div className="flex justify-between items-center mb-3 z-10">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Latest Actual</p>
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></div>
        </div>
        <div className="flex items-baseline gap-1.5 z-10">
          <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
            {latestActual ? latestActual.toLocaleString() : "--"}
          </span>
          <span className="text-sm font-bold text-slate-400">MW</span>
        </div>
      </div>

      {/* Latest Forecast Card */}
      <div className="bg-white p-6 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col relative overflow-hidden group hover:border-emerald-200 transition-colors">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-50 to-transparent rounded-bl-full"></div>
        <div className="flex justify-between items-center mb-3 z-10">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Latest Forecast</p>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
        </div>
        <div className="flex items-baseline gap-1.5 z-10">
          <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
            {latestForecast ? latestForecast.toLocaleString() : "--"}
          </span>
          <span className="text-sm font-bold text-slate-400">MW</span>
        </div>
      </div>

      {/* MAE Card */}
      <div className="bg-white p-6 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col relative overflow-hidden group hover:border-cyan-200 transition-colors">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-50 to-transparent rounded-bl-full"></div>
        <div className="flex justify-between items-center mb-3 z-10">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">MAE Error</p>
          <div className="text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded text-[10px] font-extrabold">ERR</div>
        </div>
        <div className="flex items-baseline gap-1.5 z-10">
          <span className="text-3xl font-extrabold text-slate-800 tracking-tight">{mae.toLocaleString()}</span>
          <span className="text-sm font-bold text-slate-400">MW</span>
        </div>
      </div>

      {/* RMSE Card */}
      <div className="bg-white p-6 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col relative overflow-hidden group hover:border-purple-200 transition-colors">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-50 to-transparent rounded-bl-full"></div>
        <div className="flex justify-between items-center mb-3 z-10">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">RMSE Dev</p>
          <div className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded text-[10px] font-extrabold">DEV</div>
        </div>
        <div className="flex items-baseline gap-1.5 z-10">
          <span className="text-3xl font-extrabold text-slate-800 tracking-tight">{rmse.toLocaleString()}</span>
          <span className="text-sm font-bold text-slate-400">MW</span>
        </div>
      </div>
    </div>
  );
}
