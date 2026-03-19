from fastapi import APIRouter, Query, HTTPException
from datetime import datetime, timezone
from services.elexon import fetch_actuals, fetch_forecasts
from services.processor import get_latest_forecasts_for_horizon, compute_metrics
from models.schemas import ForecastResponse, GenerationPoint

router = APIRouter()

@router.get("/api/forecast-data", response_model=ForecastResponse)
async def get_forecast_data(
    start:   str   = Query(...),
    end:     str   = Query(...),
    horizon: float = Query(4.0, ge=0, le=48)
):
    try:
        start_dt = datetime.fromisoformat(start.replace("Z", "+00:00")).replace(tzinfo=timezone.utc)
        end_dt   = datetime.fromisoformat(end.replace("Z", "+00:00")).replace(tzinfo=timezone.utc)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use ISO8601.")

    if start_dt >= end_dt:
        raise HTTPException(status_code=400, detail="start must be before end")

    actuals_df   = await fetch_actuals(start_dt, end_dt)
    forecasts_df = await fetch_forecasts(start_dt, end_dt)
    filtered     = get_latest_forecasts_for_horizon(forecasts_df, horizon)
    metrics      = compute_metrics(actuals_df, filtered)

    return ForecastResponse(
        actuals=[
            GenerationPoint(time=row["startTime"], value=row["generation"])
            for _, row in actuals_df.iterrows()
        ],
        forecasts=[
            GenerationPoint(time=row["startTime"], value=row["generation"])
            for _, row in filtered.iterrows()
        ],
        mae=metrics["mae"],
        rmse=metrics["rmse"]
    )
