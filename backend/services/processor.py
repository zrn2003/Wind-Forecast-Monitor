import pandas as pd
import numpy as np


def get_latest_forecasts_for_horizon(forecasts_df: pd.DataFrame, horizon_hours: float) -> pd.DataFrame:
    if forecasts_df.empty:
        return pd.DataFrame(columns=["startTime", "generation"])

    df = forecasts_df[forecasts_df["horizon_hours"] >= horizon_hours].copy()

    if df.empty:
        return pd.DataFrame(columns=["startTime", "generation"])

    idx = df.groupby("startTime")["publishTime"].idxmax()
    return df.loc[idx][["startTime", "generation"]].reset_index(drop=True)


def compute_metrics(actuals: pd.DataFrame, forecasts: pd.DataFrame) -> dict:
    merged = pd.merge(
        actuals.rename(columns={"generation": "actual"}),
        forecasts.rename(columns={"generation": "forecast"}),
        on="startTime",
        how="inner"
    )
    if merged.empty:
        return {"mae": None, "rmse": None}

    errors = merged["forecast"] - merged["actual"]
    mae  = float(np.mean(np.abs(errors)))
    rmse = float(np.sqrt(np.mean(errors ** 2)))
    return {"mae": round(mae, 2), "rmse": round(rmse, 2)}
