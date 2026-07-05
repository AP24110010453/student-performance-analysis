from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Optional
import time

from .models import RecommendationRequest, StudentProfile

app = FastAPI(title="AI Personalized Learning Platform", version="1.1.0")

# Enable CORS for the frontend React application
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "ok", "message": "Personalized Learning AI Backend operates correctly."}


@app.post("/api/recommend")
def get_recommendations(request: RecommendationRequest):
    """
    Generate personalized learning recommendations.
    Provides robust fallback mocked data simulating a Recommendation Engine
    if external ML weights/Kaggle datasets aren't present.
    """
    # Delay to simulate ML inference
    time.sleep(0.5)
    
    # Mock fallback logic simulating KNN / nearest neighbors distance output
    recommendations = [
        {"content_id": "Advanced Mathematics: Calculus Fundamentals", "confidence": 0.94, "time": "45 min"},
        {"content_id": "Physics Labs: Mechanics Simulation", "confidence": 0.88, "time": "60 min"},
        {"content_id": "Literature: Modern Poetry Analysis", "confidence": 0.72, "time": "20 min"}
    ]
    
    return {"recommendations": recommendations[:request.num_recommendations]}


@app.post("/api/visual-engagement")
def analyze_engagement():
    """
    Simulate Datature visual AI inference.
    """
    import random
    score = random.randint(50, 100)
    return {
        "engagement_score": score,
        "alert": score < 60,
        "detected_expressions": [{"label": "attentive", "confidence": score/100.0}]
    }