import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const API_BASE = "http://localhost:8000";

function Dashboard() {
    const [studentId, setStudentId] = useState("");
    const [recommendations, setRecommendations] = useState([]);
    const [engagementData, setEngagementData] = useState(null);
    const [performanceData, setPerformanceData] = useState([]);

    const fetchRecommendations = async () => {
        const response = await axios.post(`${API_BASE}/api/recommend`, {
            student: {
                student_id: studentId,
                previous_scores: { math: 75, reading: 80, writing: 70 },
                learning_style: "visual"
            },
            num_recommendations: 5
        });
        setRecommendations(response.data.recommendations);
    };

    const analyzeEngagement = async (imageFile) => {
        // Upload image to backend for Datature analysis
        const formData = new FormData();
        formData.append("file", imageFile);
        const response = await axios.post(`${API_BASE}/api/visual-engagement`, formData);
        setEngagementData(response.data);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">🎓 AI Personalized Learning Dashboard</h1>

            {/* Student Selector */}
            <div className="mt-4">
                <input
                    type="text"
                    placeholder="Enter Student ID"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="border p-2 rounded"
                />
                <button onClick={fetchRecommendations} className="ml-2 bg-blue-500 text-white p-2 rounded">
                    Get Recommendations
                </button>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-xl">📚 Recommended Learning Modules</h2>
                    <ul className="list-disc pl-6">
                        {recommendations.map((rec, idx) => (
                            <li key={idx}>{rec.content_id} (Confidence: {rec.confidence.toFixed(2)})</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Engagement Alert */}
            {engagementData?.alert && (
                <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
                    ⚠️ Low engagement detected! Consider adjusting lesson pacing.
                </div>
            )}
        </div>
    );
}

export default Dashboard;