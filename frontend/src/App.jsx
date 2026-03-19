import { useCallback, useEffect } from "react";
import { useForecastData } from "./hooks/useForecastData";
import Controls  from "./components/Controls";
import Chart     from "./components/Chart";
import StatsBar  from "./components/StatsBar";
import dayjs from "dayjs";

export default function App() {
  const { data, loading, error, fetchData } = useForecastData();

  const handleUpdate = useCallback((start, end, horizon) => {
    fetchData(start, end, horizon);
  }, [fetchData]);

  useEffect(() => {
    fetchData(
      dayjs().subtract(1, "day").toISOString(),
      dayjs().toISOString(),
      4
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans p-4 md:p-8 md:pt-12 selection:bg-blue-200 antialiased">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Header Section */}
        <div className="mb-2 px-2">
          {/* iOS Style Large Title */}
          <h1 className="text-[34px] leading-[41px] font-semibold tracking-[-0.02em] text-[#000000]">
            Wind Forecast Monitor
          </h1>
          <p className="text-[#6e6e73] text-[15px] leading-[24px] mt-2 max-w-xl">
            Real-time monitoring of UK National Wind Power Generation. Compare actual transmission data against predictive horizons.
          </p>
        </div>
        
        <Controls onSubmit={handleUpdate} loading={loading} />
        
        {loading && (
          <div className="flex justify-center items-center h-48 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.04)]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-blue-100 border-t-[#007aff] rounded-full animate-spin"></div>
              <p className="text-[#007aff] font-semibold text-[15px] tracking-wide">Processing Data...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl px-5 py-4 text-[15px] font-medium shadow-sm flex items-center gap-3">
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}
        
        {data && !loading && (
          <div className="flex flex-col gap-6 opacity-100 transition-opacity duration-500">
            <StatsBar 
              mae={data.mae} 
              rmse={data.rmse} 
              latestActual={data.actuals?.length > 0 ? data.actuals[data.actuals.length - 1].value : null}
              latestForecast={data.forecasts?.length > 0 ? data.forecasts[data.forecasts.length - 1].value : null}
            />
            <div className="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-[#e5e5ea] p-2 md:p-6 overflow-hidden">
              <Chart actuals={data.actuals} forecasts={data.forecasts} />
            </div>
            
            {/* Information Card - Lower Section */}
            <div className="mt-2 bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-[#e5e5ea] p-6 md:p-8">
              <h2 className="text-[22px] leading-[28px] font-semibold tracking-[-0.01em] text-black mb-4">About the Forecast Data</h2>
              <div className="text-[15px] leading-[24px] text-[#424245] space-y-4">
                <p>
                  This dashboard visualizes high-frequency data directly from the <strong>Elexon BMRS (Balancing Mechanism Reporting Service)</strong> API to evaluate the reliability and precision of wind power capacity predictions on the UK National Grid.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="bg-[#f5f5f7] p-5 rounded-xl border border-[#e5e5ea]">
                    <h3 className="text-[15px] font-semibold text-black mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#007aff]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      Actuals & Forecasts
                    </h3>
                    <p className="text-[14px] leading-relaxed">
                      <strong>Actual Generation (B1610)</strong> reflects the true metered wind power transmitted to the grid. <strong>Forecast Targets (WINDFOR)</strong> reflect the predicted supply declared hours ahead. By aligning the selected <em>Forecast Horizon</em> with the actual timelines, we accurately measure how prediction targets hold up dynamically.
                    </p>
                  </div>
                  <div className="bg-[#f5f5f7] p-5 rounded-xl border border-[#e5e5ea]">
                    <h3 className="text-[15px] font-semibold text-black mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#af52de]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                      Performance Metrics
                    </h3>
                    <p className="text-[14px] leading-relaxed">
                      We track estimation uncertainty via <strong>Mean Absolute Error (MAE)</strong> (the average absolute drift in MW) and <strong>Root Mean Square Error (RMSE)</strong> (which penalizes large singular miss-estimations). Low errors mean the grid can confidently depend on wind capacity without dispatching polluting backup buffer plants.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* End of Lower Section */}

          </div>
        )}
      </div>
    </div>
  );
}
