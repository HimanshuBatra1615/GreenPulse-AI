import os
import torch
import torch.nn as nn
import torch.optim as optim
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv("../backend/.env")

url: str = os.getenv("SUPABASE_URL", "")
key: str = os.getenv("SUPABASE_ANON_KEY", "")
supabase: Client = create_client(url, key)

class EnergyLSTM(nn.Module):
    def __init__(self, input_size=1, hidden_layer_size=64, output_size=1):
        super(EnergyLSTM, self).__init__()
        self.hidden_layer_size = hidden_layer_size
        self.lstm = nn.LSTM(input_size, hidden_layer_size, batch_first=True)
        self.linear = nn.Linear(hidden_layer_size, output_size)

    def forward(self, input_seq):
        lstm_out, _ = self.lstm(input_seq)
        predictions = self.linear(lstm_out[:, -1, :])
        return predictions

def get_data_from_supabase():
    print("Fetching historical data from Supabase...")
    # Fetch top 1000 to keep it manageable
    response = supabase.table("energy_readings").select("timestamp,consumption_kw").order("timestamp", desc=False).limit(1000).execute()
    data = response.data
    
    if not data:
        print("No data found. Ensure Simulator has seeded DB.")
        # Return fallback dummy data
        t = np.linspace(0, 100, 1000)
        y = 100 + 40 * np.sin(t) + np.random.normal(0, 5, 1000)
        df = pd.DataFrame({"consumption_kw": y})
    else:
        df = pd.DataFrame(data)
        
    return df['consumption_kw'].values.reshape(-1, 1)

def create_sequences(data, seq_length):
    xs = []
    ys = []
    for i in range(len(data)-seq_length-1):
        x = data[i:(i+seq_length)]
        y = data[i+seq_length]
        xs.append(x)
        ys.append(y)
    return np.array(xs), np.array(ys)

def train_model():
    data = get_data_from_supabase()
    scaler = MinMaxScaler(feature_range=(-1, 1))
    data_normalized = scaler.fit_transform(data)
    
    seq_length = 24
    X, y = create_sequences(data_normalized, seq_length)
    
    X_train = torch.tensor(X, dtype=torch.float32)
    y_train = torch.tensor(y, dtype=torch.float32)
    
    model = EnergyLSTM()
    loss_function = nn.MSELoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)
    
    epochs = 50
    print(f"Training LSTM Model for {epochs} epochs...")
    for i in range(epochs):
        optimizer.zero_grad()
        y_pred = model(X_train)
        single_loss = loss_function(y_pred, y_train)
        single_loss.backward()
        optimizer.step()
        
        if i % 10 == 0:
            print(f'Epoch {i} loss: {single_loss.item():.4f}')
            
    os.makedirs("saved_models", exist_ok=True)
    torch.save(model.state_dict(), "saved_models/lstm_model.pt")
    print("Model saved to saved_models/lstm_model.pt")

if __name__ == "__main__":
    train_model()
