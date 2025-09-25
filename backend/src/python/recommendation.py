import pandas as pd
import joblib
import os

# Base directory of this script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# -----------------------------
# Load prediction dataset
# -----------------------------
pred_df_path = os.path.join(BASE_DIR, "../../datasets/recommendation_workers.csv")
pred_df = pd.read_csv(pred_df_path)

# Fix: If assigned_tasks = 0, then avg_difficulty = 0
pred_df.loc[pred_df["assigned_tasks"] == 0, "avg_difficulty"] = 0


# Load model
model_path = os.path.join(BASE_DIR, "worker_recommendation_model.pkl")
rf = joblib.load(model_path)

# Predict scores

# features = ["assigned_tasks", "avg_difficulty", "locality_rating", "citizen_rating"]
# pred_df["predicted_score"] = rf.predict(pred_df[features])


# Load scaler

scaler_path = os.path.join(BASE_DIR, "scaler_recommendation.pkl")
scaler = joblib.load(scaler_path)

# Predict scores (with scaling)

features = ["assigned_tasks", "avg_difficulty", "locality_rating", "citizen_rating"]
pred_df_scaled = scaler.transform(pred_df[features])
pred_df["predicted_score"] = rf.predict(pred_df_scaled)

# Sort leaderboard
leaderboard = pred_df.sort_values("predicted_score", ascending=False).reset_index(drop=True)

leaderboard_path = os.path.join(BASE_DIR, "../../datasets/recommended.csv")
leaderboard.to_csv(leaderboard_path, index=False)

print(f" Leaderboard saved as {leaderboard_path}")



