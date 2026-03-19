import { useState } from "react";
import dayjs from "dayjs";

export default function Controls({ onSubmit, loading }) {
  const [start,   setStart]   = useState(dayjs().subtract(1, "day").format("YYYY-MM-DDTHH:mm"));
  const [end,     setEnd]     = useState(dayjs().format("YYYY-MM-DDTHH:mm"));
  const [horizon, setHorizon] = useState(4);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-[#e5e5ea] flex flex-col md:flex-row items-center gap-6 w-full font-sans transition-all">
      <div className="flex flex-col gap-1.5 w-full md:w-[240px]">
        <label className="text-[13px] font-semibold text-[#8e8e93] uppercase tracking-wider">Start Time</label>
        <input type="datetime-local" value={start} min="2025-01-01T00:00" onChange={e => setStart(e.target.value)}
          className="border border-[#d1d1d6] bg-[#f2f2f7] hover:bg-white rounded-[10px] px-4 py-2.5 text-[15px] text-[#1d1d1f] focus:outline-none focus:ring-[3px] focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all cursor-pointer shadow-inner" />
      </div>
      <div className="flex flex-col gap-1.5 w-full md:w-[240px]">
        <label className="text-[13px] font-semibold text-[#8e8e93] uppercase tracking-wider">End Time</label>
        <input type="datetime-local" value={end} min="2025-01-01T00:00" onChange={e => setEnd(e.target.value)}
          className="border border-[#d1d1d6] bg-[#f2f2f7] hover:bg-white rounded-[10px] px-4 py-2.5 text-[15px] text-[#1d1d1f] focus:outline-none focus:ring-[3px] focus:ring-[#007aff]/20 focus:border-[#007aff] transition-all cursor-pointer shadow-inner" />
      </div>
      <div className="flex flex-col gap-1.5 w-full md:flex-grow">
        <label className="text-[13px] font-semibold text-[#8e8e93] uppercase tracking-wider flex justify-between">
          <span>Forecast Horizon</span>
          <span className="text-[#007aff] font-bold bg-[#007aff]/10 px-2 py-[1px] rounded-[6px]">{horizon} Hours</span>
        </label>
        <input type="range" min={0} max={48} step={0.5} value={horizon}
          onChange={e => setHorizon(Number(e.target.value))} 
          className="my-3 w-full h-2 bg-[#d1d1d6] rounded-lg appearance-none cursor-pointer accent-[#007aff] hover:accent-[#005bb5] transition-all" />
      </div>
      <div className="w-full md:w-auto flex items-end">
        <button 
          onClick={() => onSubmit(dayjs(start).toISOString(), dayjs(end).toISOString(), horizon)}
          disabled={loading}
          className="w-full md:w-auto mt-4 md:mt-0 bg-[#007aff] text-white font-medium px-8 py-[11px] rounded-[10px] text-[15px] hover:bg-[#0062cc] active:bg-[#005bb5] shadow-sm shadow-[#007aff]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
          {loading ? (
             <span className="flex items-center gap-2 justify-center">
               <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
               Syncing
             </span>
          ) : "Apply Filter"}
        </button>
      </div>
    </div>
  );
}
