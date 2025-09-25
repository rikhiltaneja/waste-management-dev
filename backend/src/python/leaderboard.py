import pandas as pd
import numpy as np
import joblib
import os

# Base directory of this script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load prediction dataset
pred_df_path = os.path.join(BASE_DIR, "../../datasets/workers.csv")
pred_df = pd.read_csv(pred_df_path)

# Fix invalid cases
# pred_df["tasks_completed"] = pred_df[["tasks_completed","tasks_assigned"]].min(axis=1)
pred_df["completion_ratio"] = (pred_df["tasks_completed"]/pred_df["tasks_assigned"]).clip(0,1)

# Load model & scaler
rf = joblib.load(os.path.join(BASE_DIR, "worker_model.pkl"))
scaler = joblib.load(os.path.join(BASE_DIR, "scaler.pkl"))

features = ["completion_ratio","avg_difficulty","locality_rating","citizen_rating"]
X_pred = pred_df[features].values
X_pred_scaled = scaler.transform(X_pred)

# Predict score
pred_df["predicted_score"] = rf.predict(X_pred_scaled)

# Sort leaderboard
leaderboard_path = os.path.join(BASE_DIR, "../../datasets/leaderboard.csv")
leaderboard = pred_df.sort_values("predicted_score", ascending=False).reset_index(drop=True)
leaderboard.to_csv(leaderboard_path, index=False)

print(f"Leaderboard saved as {leaderboard_path}")