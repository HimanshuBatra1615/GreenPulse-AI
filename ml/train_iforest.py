import os
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
import pickle
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv("../backend/.env")

url: str = os.getenv("SUPABASE_URL", "")
key: str = os.getenv("SUPABASE_ANON_KEY", "")
supabase: Client = create_client(url, key)

def train_anomaly_detector():
    print("Fetching training data for Isolation Forest...")
    res = supabase.table("energy_readings").select("consumption_kw").limit(2000).execute()
    data = res.data
    
    if not data:
        print("No DB data. Using synthetic points.")
        df = pd.DataFrame({"consumption_kw": np.random.normal(100, 10, 2000)})
        # Inject anomalies
        df.loc[10:15, "consumption_kw"] = 250
        X = df[['consumption_kw']]
    else:
        df = pd.DataFrame(data)
        X = df[['consumption_kw']]
        
    print("Training Isolation Forest...")
    model = IsolationForest(contamination=0.01, random_state=42)
    model.fit(X)
    
    os.makedirs("saved_models", exist_ok=True)
    with open("saved_models/iforest.pkl", "wb") as f:
        pickle.dump(model, f)
        
    print("Anomaly Detector saved to saved_models/iforest.pkl")

if __name__ == "__main__":
    train_anomaly_detector()
