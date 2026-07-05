import os
from datature import nexus
import requests

class DatatureClient:
    def __init__(self):
        self.project_secret = os.getenv("DATATURE_PROJECT_SECRET")
        self.client = nexus.Client(self.project_secret)
        
    def detect_engagement(self, image_url: str):
        """Send an image to Datature inference API and return engagement predictions."""
        # Option 1: Use Datature's hosted inference API
        api_url = f"https://api.datature.io/v1/predict/{self.project_secret}"
        response = requests.post(api_url, json={"url": image_url})
        predictions = response.json()
        
        # Parse predictions into engagement metrics
        engagement_score = self._compute_engagement(predictions)
        return {
            "engagement_score": engagement_score,
            "detected_expressions": predictions.get("detections", []),
            "alert": engagement_score < 0.4
        }
    
    def _compute_engagement(self, predictions):
        """Convert object detections to an engagement score."""
        # Custom logic: e.g., "attentive" = 1.0, "distracted" = 0.2
        detections = predictions.get("detections", [])
        if not detections:
            return 0.5
        weights = {"attentive": 1.0, "neutral": 0.6, "distracted": 0.2, "confused": 0.3}
        scores = [weights.get(d["label"], 0.5) for d in detections]
        return sum(scores) / len(scores)