# backend/app/analytics.py
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

def generate_performance_chart(student_id: str, df: pd.DataFrame):
    """Generate a line chart of student performance over time."""
    student_df = df[df["student_id"] == student_id]
    plt.figure(figsize=(10, 6))
    sns.lineplot(data=student_df, x="attempt_number", y="score", hue="module")
    plt.title(f"Performance Trend for Student {student_id}")
    plt.savefig(f"static/{student_id}_trend.png")
    return f"/static/{student_id}_trend.png"