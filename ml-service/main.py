from fastapi import FastAPI, Query, Body
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import os

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Model and scaler paths
RECOMM_MODEL_PATH = os.path.join(BASE_DIR, "worker_recommendation_model.pkl")
RECOMM_SCALER_PATH = os.path.join(BASE_DIR, "scaler_recommendation.pkl")
LEADER_MODEL_PATH = os.path.join(BASE_DIR, "worker_model.pkl")
LEADER_SCALER_PATH = os.path.join(BASE_DIR, "scaler.pkl")

# Dataset paths
RECOMM_WORKERS_PATH = os.path.join(BASE_DIR, "datasets/recommendation_workers.csv")
LEADER_WORKERS_PATH = os.path.join(BASE_DIR, "datasets/workers.csv")

class PredictWorkerRequest(BaseModel):
    completion_ratio: float
    citizen_rating: int
    locality_rating: int
    task_difficulty: int

@app.post("/predict-worker")
def predict_worker(data: PredictWorkerRequest):
    rf = joblib.load(LEADER_MODEL_PATH)
    scaler = joblib.load(LEADER_SCALER_PATH)
    X_new = np.array([[data.completion_ratio, data.citizen_rating, data.locality_rating, data.task_difficulty]])
    X_new_scaled = scaler.transform(X_new)
    pred_score = rf.predict(X_new_scaled)[0]
    return {"predicted_score": float(pred_score)}

@app.get("/leaderboard")
def get_leaderboard():
    pred_df = pd.read_csv(LEADER_WORKERS_PATH)
    pred_df["completion_ratio"] = (pred_df["tasks_completed"]/pred_df["tasks_assigned"]).clip(0,1)
    rf = joblib.load(LEADER_MODEL_PATH)
    scaler = joblib.load(LEADER_SCALER_PATH)
    features = ["completion_ratio","avg_difficulty","locality_rating","citizen_rating"]
    X_pred = pred_df[features].values
    X_pred_scaled = scaler.transform(X_pred)
    pred_df["predicted_score"] = rf.predict(X_pred_scaled)
    leaderboard = pred_df.sort_values("predicted_score", ascending=False).reset_index(drop=True)
    return leaderboard.to_dict(orient="records")

@app.get("/recommend")
def recommend_workers(
    locality: str = Query(None),
    worker_type: str = Query(None),
    limit: int = Query(10),
):
    pred_df = pd.read_csv(RECOMM_WORKERS_PATH)
    pred_df.loc[pred_df["assigned_tasks"] == 0, "avg_difficulty"] = 0
    rf = joblib.load(RECOMM_MODEL_PATH)
    scaler = joblib.load(RECOMM_SCALER_PATH)
    features = ["assigned_tasks", "avg_difficulty", "locality_rating", "citizen_rating"]
    pred_df_scaled = scaler.transform(pred_df[features])
    pred_df["predicted_score"] = rf.predict(pred_df_scaled)
    leaderboard = pred_df.sort_values("predicted_score", ascending=False).reset_index(drop=True)
    # Filtering logic
    if locality:
        leaderboard = leaderboard[leaderboard["locality"] == locality]
    if worker_type:
        leaderboard = leaderboard[leaderboard["worker_type"] == worker_type]
    # Removed limit: return all filtered results
    return leaderboard.to_dict(orient="records")