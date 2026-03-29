import os
import json
import asyncio
from fastapi import FastAPI, BackgroundTasks, Depends
from fastapi.middleware.cors import CORSMiddleware
import socketio
from dotenv import load_dotenv
from supabase import create_client, Client
import google.generativeai as genai

load_dotenv()

# Initialize Supabase
url: str = os.getenv("SUPABASE_URL", "")
key: str = os.getenv("SUPABASE_ANON_KEY", "")
supabase: Client = create_client(url, key)

# Initialize Gemini
genai.configure(api_key=os.environ.get("GEMINI_API_KEY", ""))
gemini_model = genai.GenerativeModel("gemini-1.5-flash")

# FastAPI App
app = FastAPI(title="GreenPulse AI Backend")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# SocketIO
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins='*')
socket_app = socketio.ASGIApp(sio, other_asgi_app=app)
app.mount("/", socket_app)

@app.get("/")
async def root():
    return {"status": "GreenPulse API is alive"}

@app.post("/recommendations")
async def get_recommendations(context: dict):
    prompt = f"""You are an energy optimization AI for an SME.
    Current data: {json.dumps(context)}
    Give exactly 3 recommendations in JSON format:
    [{{"priority": "URGENT/OPTIMIZE/VPP",
      "text": "plain English action",
      "saving": "₹ estimate"}}]
    Return only the JSON array, nothing else."""
    
    response = gemini_model.generate_content(prompt)
    try:
        # Try to parse the raw text as JSON cleanly
        text = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(text)
    except:
        return [{"priority": "OPTIMIZE", "text": "Reduce base load", "saving": "₹ 500"}]

@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")

@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")

# Include routers here later (Auth, Data, ML)
