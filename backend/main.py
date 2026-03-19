from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.forecasts import router

app = FastAPI(title="Wind Forecast Monitor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/health")
def health():
    return {"status": "ok"}
