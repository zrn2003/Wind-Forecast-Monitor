import httpx
import pandas as pd
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()
BASE_URL = os.getenv("ELEXON_BASE_URL", "https://data.elexon.co.uk/bmrs/api/v1")


async def fetch_actuals(start: datetime, end: datetime) -> pd.DataFrame:
    url = f"{BASE_URL}/datasets/FUELHH/stream"
    params = {
        "settlementDateFrom": start.strftime("%Y-%m-%d"),
        "settlementDateTo":   end.strftime("%Y-%m-%d"),
        "fuelType":           "WIND",
    }
    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        data = response.json()

    if not data:
        return pd.DataFrame(columns=["startTime", "generation"])

    records = [
        {"startTime": r["startTime"], "generation": r["generation"]}
        for r in data
        if r.get("generation") is not None and r.get("fuelType") == "WIND"
    ]

    if not records:
        return pd.DataFrame(columns=["startTime", "generation"])

    df = pd.DataFrame(records)
    df["startTime"] = pd.to_datetime(df["startTime"], utc=True)
    df = df[
        (df["startTime"] >= pd.Timestamp(start)) &
        (df["startTime"] <= pd.Timestamp(end))
    ]
    return df.sort_values("startTime").drop_duplicates("startTime").reset_index(drop=True)


async def fetch_forecasts(start: datetime, end: datetime) -> pd.DataFrame:
    url = f"{BASE_URL}/datasets/WINDFOR/stream"
    publish_from = pd.Timestamp(start) - pd.Timedelta(hours=48)
    params = {
        "publishDateTimeFrom": publish_from.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "publishDateTimeTo":   pd.Timestamp(end).strftime("%Y-%m-%dT%H:%M:%SZ"),
    }
    async with httpx.AsyncClient(timeout=60) as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        data = response.json()

    if not data:
        return pd.DataFrame(columns=["startTime", "publishTime", "generation", "horizon_hours"])

    records = [
        {
            "startTime":   r["startTime"],
            "publishTime": r["publishTime"],
            "generation":  r["generation"],
        }
        for r in data
        if r.get("generation") is not None
        and r.get("startTime") is not None
        and r.get("publishTime") is not None
    ]

    if not records:
        return pd.DataFrame(columns=["startTime", "publishTime", "generation", "horizon_hours"])

    df = pd.DataFrame(records)
    df["startTime"]   = pd.to_datetime(df["startTime"],   utc=True)
    df["publishTime"] = pd.to_datetime(df["publishTime"], utc=True)

    jan_2025 = pd.Timestamp("2025-01-01", tz="UTC")
    df = df[df["startTime"] >= jan_2025]

    df["horizon_hours"] = (df["startTime"] - df["publishTime"]).dt.total_seconds() / 3600
    df = df[(df["horizon_hours"] >= 0) & (df["horizon_hours"] <= 48)]
    df = df[
        (df["startTime"] >= pd.Timestamp(start)) &
        (df["startTime"] <= pd.Timestamp(end))
    ]
    return df.sort_values(["startTime", "publishTime"]).reset_index(drop=True)
