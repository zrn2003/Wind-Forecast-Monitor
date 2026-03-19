import httpx
import asyncio

BASE = "https://data.elexon.co.uk/bmrs/api/v1"

async def test():
    # Test FUELHH (Actuals)
    r1 = await httpx.AsyncClient(timeout=60).get(
        f"{BASE}/datasets/FUELHH/stream",
        params={
            "settlementDateFrom": "2025-01-01",
            "settlementDateTo":   "2025-01-02",
            "fuelType":           "WIND"
        }
    )
    print("FUELHH Status:", r1.status_code)
    print("FUELHH Sample:", r1.json()[:2])

    # Test WINDFOR (Forecasts)
    r2 = await httpx.AsyncClient(timeout=60).get(
        f"{BASE}/datasets/WINDFOR/stream",
        params={
            "publishDateTimeFrom": "2025-01-01T00:00:00Z",
            "publishDateTimeTo":   "2025-01-02T00:00:00Z",
        }
    )
    print("WINDFOR Status:", r2.status_code)
    print("WINDFOR Sample:", r2.json()[:2])

asyncio.run(test())
