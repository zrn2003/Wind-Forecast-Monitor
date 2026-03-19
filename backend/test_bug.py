import asyncio
from datetime import datetime
from services.elexon import fetch_actuals, fetch_forecasts
from services.processor import get_latest_forecasts_for_horizon, compute_metrics

async def main():
    start = "2026-03-18T08:03:54.747Z"
    end = "2026-03-19T08:03:54.747Z"
    horizon = 4.0

    # Start same as forecasts.py logic
    try:
        from datetime import timezone
        start_dt = datetime.fromisoformat(start.replace("Z", "+00:00")).replace(tzinfo=timezone.utc)
        end_dt   = datetime.fromisoformat(end.replace("Z", "+00:00")).replace(tzinfo=timezone.utc)
    except Exception as e:
        print(f"Exception parsing: {type(e).__name__} {e}")
        return

    print("Parsed dates:", start_dt, end_dt)

    try:
        actuals_df   = await fetch_actuals(start_dt, end_dt)
        print("Actuals shape:", actuals_df.shape)
        forecasts_df = await fetch_forecasts(start_dt, end_dt)
        print("Forecasts shape:", forecasts_df.shape)
        filtered     = get_latest_forecasts_for_horizon(forecasts_df, horizon)
        print("Filtered shape:", filtered.shape)
        metrics      = compute_metrics(actuals_df, filtered)
        print("Metrics:", metrics)
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
