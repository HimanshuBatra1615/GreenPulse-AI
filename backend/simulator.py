import os
import time
import asyncio
import random
import math
from datetime import datetime, timedelta
from dotenv import load_dotenv
from supabase import create_client, Client
import socketio

load_dotenv()

url: str = os.getenv("SUPABASE_URL", "")
key: str = os.getenv("SUPABASE_ANON_KEY", "")
supabase: Client = create_client(url, key)

sio = socketio.AsyncClient()

def generate_realistic_reading(hour: int, is_weekend: bool):
    """Generates a realistic kW reading based on the time of day."""
    base = 70 # night time load
    if 8 <= hour < 12:
        base += 40 * math.sin((hour - 8)/4 * math.pi/2)
    elif 12 <= hour < 17:
        base += 70 # Peak afternoon
    elif 17 <= hour < 21:
        base += 30
        
    if is_weekend:
        base *= 0.7 # 30% drop on weekends
        
    noise = random.uniform(-0.05 * base, 0.05 * base)
    
    # 1% chance of anomaly
    is_anomaly = random.random() < 0.01
    if is_anomaly:
        base += 50 # massive spike
        
    return base + noise, is_anomaly

async def seed_historical_data(sme_id: str):
    """Pre-generates 30 days of 1-hour interval historical data into Supabase."""
    print("Checking if historical data exists...")
    # Just check if we have more than 0 records
    res = supabase.table("energy_readings").select("id", count="exact").eq("sme_id", sme_id).limit(1).execute()
    if res.count and res.count > 0:
        print("Historical data already seeded.")
        return

    print("Seeding 30 days of historical data...")
    now = datetime.now()
    records = []
    
    # Generate 30 days of hourly data (720 records)
    for i in range(720, 0, -1):
        ts = now - timedelta(hours=i)
        is_wknd = ts.weekday() >= 5
        kw, anomaly = generate_realistic_reading(ts.hour, is_wknd)
        records.append({
            "sme_id": sme_id,
            "timestamp": ts.isoformat(),
            "consumption_kw": kw,
            "is_anomaly": anomaly
        })
        
        # Batch insert every 100
        if len(records) >= 100:
            supabase.table("energy_readings").insert(records).execute()
            records = []
            
    if records:
        supabase.table("energy_readings").insert(records).execute()
    print("Seeding complete.")


async def live_simulation_loop():
    """Pushes new data to websockets and DB every 5 seconds."""
    # First, let's create a test SME profile if none exists
    res = supabase.table("sme_profiles").select("id").limit(1).execute()
    
    sme_id = None
    if not res.data:
        print("WARNING: No SME profiles. Skipping live tick. Create a user via supabase first.")
        # But for simulation, we can just omit saving to DB, or wait.
        sme_id = "00000000-0000-0000-0000-000000000000" # fallback
    else:
        sme_id = res.data[0]['id']
        await seed_historical_data(sme_id)

    print("Connecting to SocketIO server...")
    try:
        await sio.connect('http://localhost:8000')
    except:
        print("Socket IO server offline. Will run without broadcasting.")

    while True:
        now = datetime.now()
        is_wknd = now.weekday() >= 5
        kw, anomaly = generate_realistic_reading(now.hour, is_wknd)
        
        reading = {
            "sme_id": sme_id,
            "timestamp": now.isoformat(),
            "consumption_kw": kw,
            "is_anomaly": anomaly
        }
        
        # Save to DB
        if sme_id != "00000000-0000-0000-0000-000000000000":
            supabase.table("energy_readings").insert([reading]).execute()
            
        print(f"TICK: {kw:.2f} kW | Anomaly: {anomaly}")
        if sio.connected:
            await sio.emit('live_reading', reading)
            
        await asyncio.sleep(5)

if __name__ == "__main__":
    asyncio.run(live_simulation_loop())
