---
id: bulldozer-price-prediction
title: "Bulldozer Price Prediction: End-to-End Time-Series ML Pipeline"
category: "Machine Learning & Forecasting"
date: "2026-02-18"
summary: "High-performance gradient boosting regression pipeline forecasting heavy equipment auction valuations, featuring custom temporal feature engineering and automated model evaluation."
githubUrl: "https://github.com/sanuzthapa/bulldozer-price-prediction"
demoUrl: "https://bulldozer-ml.demo.app"
envTemplate: |
  DATA_PATH=./data/bluebook-for-bulldozers
  MODEL_OUTPUT_DIR=./artifacts/models
  MLFLOW_TRACKING_URI=http://localhost:5000
  RANDOM_SEED=42
runInstructions:
  uv: |
    # Setup ML dependencies with fast wheel compilation
    uv venv --python 3.11
    source .venv/bin/activate # On Windows: .venv\Scripts\activate
    uv pip install -r requirements.txt
    uv run python train.py --config configs/production.yaml
  docker: |
    docker build -t bulldozer-trainer:latest .
    docker run --rm -v $(pwd)/data:/app/data -v $(pwd)/artifacts:/app/artifacts bulldozer-trainer:latest
  pip: |
    python -m venv .venv
    source .venv/bin/activate # On Windows: .venv\Scripts\activate
    pip install -r requirements.txt
    python train.py --config configs/production.yaml
verifyCommand: "python evaluate.py --model artifacts/models/rf_best.joblib --test data/valid.csv"
---

# Bulldozer Price Prediction: Forecasting Heavy Machinery Valuations

Forecasting auction sale prices of heavy industrial equipment presents unique machine learning challenges: high-cardinality categorical data, missing entries across historical machine records, and non-stationary temporal drifts across macro-economic construction boom cycles.

---

## Model Evaluation: RMSLE Optimization

The Kaggle evaluation metric for this competition is the **Root Mean Squared Log Error (RMSLE)** between the actual and predicted auction sale prices:

$$\text{RMSLE} = \sqrt{\frac{1}{n} \sum_{i=1}^{n} (\log(p_i + 1) - \log(a_i + 1))^2}$$

By calculating the error on log-transformed variables, large absolute errors on high-priced equipment do not disproportionately penalize model predictions compared to errors on budget machines.

```python
import numpy as np
from sklearn.metrics import mean_squared_log_error

def root_mean_squared_log_error(y_true, y_pred):
    """Compute Root Mean Squared Log Error (RMSLE)."""
    return np.sqrt(mean_squared_log_error(y_true, y_pred))
```

---

## Feature Engineering Breakdown

1. **Temporal Deconstruction**:
   - Extracted `saleYear`, `saleMonth`, `saleDay`, `saleDayOfWeek`, `saleDayOfYear`, and boolean flags for quarter end/start.
2. **Missing Value Imputation**:
   - Numerical missing fields were imputed with column medians while adding a binary indicator column `[column]_is_missing`.
   - String categorical values were converted into pandas categorical codes with zero-index preservation.
3. **Model Selection**:
   - Tuned `RandomForestRegressor` and `LightGBM` using Bayesian optimization over 100 iterations.
   - Achieved validation RMSLE of **0.245**, placing in the top $10\%$ benchmark.

