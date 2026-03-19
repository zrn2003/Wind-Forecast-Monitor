from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class GenerationPoint(BaseModel):
    time: datetime
    value: float

class ForecastResponse(BaseModel):
    actuals: List[GenerationPoint]
    forecasts: List[GenerationPoint]
    mae: Optional[float] = None
    rmse: Optional[float] = None
