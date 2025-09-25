import sys
import os
import numpy as np
import joblib

# Get the folder of this script
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load model and scaler using absolute paths
rf = joblib.load(os.path.join(BASE_DIR, "worker_model.pkl"))
scaler = joblib.load(os.path.join(BASE_DIR, "scaler.pkl"))

# Inputs from command line
completion_ratio = float(sys.argv[1])
citizen_rating = int(sys.argv[2])
locality_rating = int(sys.argv[3])
task_difficulty = int(sys.argv[4])

X_new = np.array([[completion_ratio, citizen_rating, locality_rating, task_difficulty]])
X_new_scaled = scaler.transform(X_new)

# Predict score
pred_score = rf.predict(X_new_scaled)[0]
print(pred_score)