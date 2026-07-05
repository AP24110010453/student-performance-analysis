from pydantic import BaseModel
from typing import List, Dict, Optional

class StudentProfile(BaseModel):
    student_id: str
    previous_scores: Dict[str, float]
    engagement_metrics: Optional[Dict] = None
    learning_style: Optional[str] = None

class RecommendationRequest(BaseModel):
    student: StudentProfile
    num_recommendations: int = 5