# Wind Forecast Monitor & Renewable Energy Reliability Analysis

A full-stack web application and data analysis project designed to visualize, monitor, and analyze national-level wind power generation in the United Kingdom, utilizing real-time API data from Elexon BMRS.

## Overview

This project is divided into two parts:

1. **Forecast Monitoring App:** A responsive React + FastAPI application that provides grid operators with an intuitive UI to compare Actual Wind Generation (`FUELHH`) against Predicted Wind Generation (`WINDFOR`). It visualizes data based on user-configured date constraints (January 2025 onwards) and variable forecast horizons (e.g., pulling the forecast created 4 hours *prior* to a target generation time).
2. **Forecast Error & Reliability Analysis:** A series of Jupyter Notebooks utilizing `pandas` and `matplotlib` to analyze how forecast accuracy degrades over longer horizons, identify diurnal patterns in prediction errors, and perform exceedance probability (ECDF) analyses to determine a safe, reliable baseline wind capacity for the national power grid.

## Tech Stack

* **Frontend:** React, Vite, Recharts, Tailwind CSS. Implements a premium iOS-inspired design for maximum readability and interactivity.
* **Backend:** Python, FastAPI, Uvicorn, `httpx`. Acts as a fast, secure proxy server, avoiding CORS errors and transforming XML/JSON from the vast Elexon API to standard JSON arrays for the chart engine.
* **Analysis Engine:** Jupyter Notebooks, Pandas, NumPy, Matplotlib.
* **Deployment Assets:** Render compatibility via `render.yaml` and `backend/Procfile`. Vercel SPA routing compatibility via `frontend/vercel.json`.

## Project Structure

```bash
├── backend/                  # FastAPI Application
│   ├── main.py               # Elexon BMRS API proxy routes & transformations
│   ├── test_api.py           # API Integration tests
│   ├── requirements.txt      # Python dependencies
│   └── Procfile              # Render deployment configuration
├── frontend/                 # React UI
│   ├── src/                  
│   │   ├── components/       # Controls, DatePickers, Chart visualization
│   │   ├── utils/            # Data formatting and MAE/RMSE calculations
│   │   ├── hooks/            # Custom React hooks (useForecastData)
│   │   └── App.jsx           # Main Dashboard
│   └── vercel.json           # Vercel Configuration
├── notebooks/                # Data Analysis & Visualizations
│   ├── 1_forecast_error_analysis.ipynb
│   └── 2_wind_reliability_analysis.ipynb
├── render.yaml               # Auto-deploy config for backend
└── README.md
```

## Running the Application Locally

### 1. Start the Backend
```cmd
cd backend
python -m venv venv

# Activate Virtual Environment (Windows)
venv\Scripts\activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Start the Frontend
```cmd
cd frontend
npm install
npm run dev
```

The app will be accessible at `http://localhost:5173`.
*Make sure the frontend `.env` points to the correct backend using `VITE_API_URL=http://localhost:8000`.*

## Key Findings (Analysis)

* **Positive Forecast Bias:** The UK wind generation models have a systemic tendency to over-predict actual output, creating a positive bias. Rare forecasting misses boast a massive 99th percentile magnitude of nearly 6,000 MW.
* **Horizon Degradation:** Through bucket grouping, data illustrates that predictions issued 0-4 hours ahead are significantly more accurate with lower variability than day-ahead (24-48 hours) predictions.
* **Reliability Metric (ECDF):** Adopting the conservative P95 baseline of 1,889 MW ensures dependable supply 95% of the time, radically reducing shortfall risks and limiting sudden emergency reliance on expensive, high-emission backup power sources.
