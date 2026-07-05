from flask import Flask, render_template, jsonify, request
import random
from datetime import datetime, timedelta

app = Flask(__name__)

# ──────────────────────────────────────────────
#  SEED DATA  (swap these functions with real
#  Datature / Kaggle calls whenever you're ready)
# ──────────────────────────────────────────────

STUDENTS = [
    {"id": 1, "name": "Emma Wilson",      "grade": "10th", "attendance": 95},
    {"id": 2, "name": "James Chen",       "grade": "10th", "attendance": 88},
    {"id": 3, "name": "Sophia Rodriguez", "grade": "11th", "attendance": 92},
    {"id": 4, "name": "Michael Brown",    "grade": "9th",  "attendance": 78},
    {"id": 5, "name": "Olivia Martinez",  "grade": "12th", "attendance": 98},
    {"id": 6, "name": "William Taylor",   "grade": "11th", "attendance": 85},
    {"id": 7, "name": "Ava Johnson",      "grade": "10th", "attendance": 91},
    {"id": 8, "name": "Ethan Davis",      "grade": "9th",  "attendance": 82},
]

ENGAGEMENT_STATES  = ["highly_engaged", "engaged", "neutral", "distracted", "very_distracted"]
ENGAGEMENT_WEIGHTS = [0.30, 0.35, 0.20, 0.10, 0.05]
ENGAGEMENT_SCORES  = {
    "highly_engaged":  90,
    "engaged":         75,
    "neutral":         60,
    "distracted":      40,
    "very_distracted": 25,
}

ACTIVITIES = [
    "Student raised hand",
    "Question asked in chat",
    "Engagement dropped below threshold",
    "New quiz started",
    "Breakout room activity",
    "Screen sharing started",
    "Poll response submitted",
]


def _engagement_for(student_id: int) -> dict:
    state = random.choices(ENGAGEMENT_STATES, weights=ENGAGEMENT_WEIGHTS)[0]
    return {
        "student_id": student_id,
        "current_engagement": state,
        "engagement_score":   ENGAGEMENT_SCORES[state],
        "timestamp": datetime.now().isoformat(),
        "facial_expressions": {
            "attentive":  random.randint(30, 90),
            "confused":   random.randint(5,  40),
            "distracted": random.randint(5,  50),
        },
    }


def _classroom_summary() -> dict:
    total = 0
    dist  = {s: 0 for s in ENGAGEMENT_STATES}
    for student in STUDENTS:
        data   = _engagement_for(student["id"])
        total += data["engagement_score"]
        dist[data["current_engagement"]] += 1
    avg = total / len(STUDENTS)
    return {
        "average_engagement":     avg,
        "distribution":           dist,
        "total_students":         len(STUDENTS),
        "alert_threshold_reached": avg < 60,
    }


def _performance_data() -> list:
    subjects = ["Mathematics", "Science", "English", "History", "Computer Science"]
    return [
        {
            "subject":          s,
            "average_score":    random.randint(65, 95),
            "improvement":      random.randint(-5, 15),
            "engagement_impact": round(random.uniform(0.5, 1.5), 2),
        }
        for s in subjects
    ]


def _realtime_activity() -> dict:
    return {
        "recent_activities": [
            {
                "time":     (datetime.now() - timedelta(minutes=i)).strftime("%H:%M"),
                "activity": random.choice(ACTIVITIES),
                "student":  random.choice(STUDENTS)["name"],
            }
            for i in range(1, 6)
        ]
    }


# ──────────────────────────────────────────────
#  ROUTES
# ──────────────────────────────────────────────

@app.route("/")
def dashboard():
    return render_template("dashboard.html")


@app.route("/api/students")
def api_students():
    return jsonify(STUDENTS)


@app.route("/api/engagement/<int:student_id>")
def api_student_engagement(student_id):
    return jsonify(_engagement_for(student_id))


@app.route("/api/classroom-summary")
def api_classroom_summary():
    return jsonify(_classroom_summary())


@app.route("/api/performance")
def api_performance():
    return jsonify(_performance_data())


@app.route("/api/realtime-activity")
def api_realtime_activity():
    return jsonify(_realtime_activity())


@app.route("/api/all-engagement")
def api_all_engagement():
    result = []
    for student in STUDENTS:
        data = _engagement_for(student["id"])
        data["student_name"] = student["name"]
        result.append(data)
    return jsonify(result)


@app.route("/api/datature-webhook", methods=["POST"])
def api_datature_webhook():
    """
    Drop-in webhook for real Datature Vision AI callbacks.
    Replace body with actual processing logic when ready.
    """
    payload = request.get_json(silent=True) or {}
    app.logger.info("Datature webhook received: %s", payload)
    return jsonify({"status": "received", "message": "Engagement data processed"})


# ──────────────────────────────────────────────
#  ENTRY POINT
# ──────────────────────────────────────────────

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
