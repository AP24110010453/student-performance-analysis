import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler
import pickle

class RecommendationEngine:
    def __init__(self, model_path=None):
        self.scaler = StandardScaler()
        self.knn = NearestNeighbors(n_neighbors=10, metric='cosine')
        self.is_trained = False
        
    def train(self, df: pd.DataFrame, feature_columns: list):
        """Train the recommendation model on student feature vectors."""
        X = df[feature_columns].values
        X_scaled = self.scaler.fit_transform(X)
        self.knn.fit(X_scaled)
        self.is_trained = True
        
    def predict(self, student_data: dict, top_k=5):
        """Find similar students and recommend content they excelled at."""
        if not self.is_trained:
            raise ValueError("Model not trained. Call train() first.")
        # Convert input to feature vector
        features = np.array([student_data.get(col, 0) for col in self.scaler.feature_names_in_])
        features_scaled = self.scaler.transform([features])
        distances, indices = self.knn.kneighbors(features_scaled, n_neighbors=top_k)
        # Return recommended content IDs (simplified)
        recommendations = [
            {"content_id": f"module_{i}", "confidence": float(1 - distances[0][i])}
            for i in range(top_k)
        ]
        return recommendations