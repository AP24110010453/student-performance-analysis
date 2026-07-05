import kagglehub
import pandas as pd
from pathlib import Path

def load_student_performance_dataset():
    """Load the popular Student Performance in Exams dataset."""
    # Download latest version of dataset
    path = kagglehub.dataset_download("spscientist/students-performance-in-exams")
    csv_path = Path(path) / "StudentsPerformance.csv"
    df = pd.read_csv(csv_path)
    return df

def load_educational_interaction_dataset():
    """Load a synthetic AI-powered learning system dataset."""
    path = kagglehub.dataset_download("datascienceaihub/ai-powered-learning-system-dataset")
    csv_path = Path(path) / "student_interactions.csv"
    df = pd.read_csv(csv_path)
    return df

# Example usage:
if __name__ == "__main__":
    df = load_student_performance_dataset()
    print(df.head())