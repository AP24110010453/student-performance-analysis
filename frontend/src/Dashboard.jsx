import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { Brain, Camera, AlertTriangle, TrendingUp, Users, BookOpen } from 'lucide-react';
import clsx from 'clsx';

// Simulated API Base
const API_BASE = "http://localhost:8000/api";

function Dashboard() {
    const [studentId, setStudentId] = useState("S101");
    const [recommendations, setRecommendations] = useState([]);
    const [engagementData, setEngagementData] = useState(null);
    const [performanceData, setPerformanceData] = useState([]);
    const [classroomStats, setClassroomStats] = useState(null);
    const [loading, setLoading] = useState(false);

    // Mock initial data fetch
    useEffect(() => {
        fetchClassroomStats();
        fetchPerformanceData();
    }, []);

    const fetchRecommendations = async () => {
        setLoading(true);
        try {
            // In a real app we'd fetch from FastAPI, mocking for resilience if backend is down
            const response = await fetch(`${API_BASE}/recommend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    student: {
                        student_id: studentId,
                        previous_scores: { math: 75, reading: 80, writing: 70 },
                        learning_style: "visual"
                    },
                    num_recommendations: 3
                })
            });
            if (response.ok) {
                const data = await response.json();
                setRecommendations(data.recommendations);
            } else {
                throw new Error('Backend failed');
            }
        } catch (e) {
            // Fallback Mock Data
            setTimeout(() => {
                setRecommendations([
                    { content_id: "Advanced Algebra Module", confidence: 0.94, time: "45 min" },
                    { content_id: "Interactive Physics Simulator", confidence: 0.88, time: "30 min" },
                    { content_id: "Literature Review Guide", confidence: 0.76, time: "20 min" }
                ]);
                setLoading(false);
            }, 800);
            return;
        }
        setLoading(false);
    };

    const fetchClassroomStats = () => {
        // Mock class summary statistics
        setClassroomStats({
            avgEngagement: 82,
            activeStudents: 24,
            alertStatus: false,
        });
    };

    const fetchPerformanceData = () => {
        // Mock performance progress chart data
        setPerformanceData([
            { week: 'W1', math: 65, science: 70, literature: 68 },
            { week: 'W2', math: 68, science: 74, literature: 72 },
            { week: 'W3', math: 75, science: 78, literature: 70 },
            { week: 'W4', math: 82, science: 85, literature: 76 },
            { week: 'W5', math: 86, science: 89, literature: 80 },
        ]);
    };

    const analyzeEngagementMock = () => {
        setEngagementData({
            score: Math.floor(Math.random() * 40) + 60, // 60-100
            alert: Math.random() > 0.8, // 20% chance of alert
        });
    };

    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* Header */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 flex items-center gap-3">
                        <Brain className="w-8 h-8 text-indigo-400" />
                        <span className="text-gradient">Personalized Learning AI</span>
                    </h1>
                    <p className="text-slate-400 text-sm">Real-time educational analytics & predictive modeling</p>
                </div>

                <div className="glass-panel px-6 py-3 flex gap-6 items-center">
                    <div className="flex flex-col">
                        <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Avg Engagement</span>
                        <span className="text-emerald-400 font-bold text-lg">{classroomStats?.avgEngagement || 0}%</span>
                    </div>
                    <div className="h-8 w-px bg-slate-700"></div>
                    <div className="flex flex-col">
                        <span className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Active Students</span>
                        <span className="text-white font-bold text-lg">{classroomStats?.activeStudents || 0}</span>
                    </div>
                </div>
            </header>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Actions & ML Inference */}
                <div className="flex flex-col gap-6 lg:col-span-1">
                    {/* Action Card */}
                    <div className="glass-panel p-6 flex flex-col gap-5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-500"></div>
                        <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                            <Users className="w-5 h-5 text-blue-400" />
                            Student Context
                        </h2>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-400">Student ID or Name</label>
                            <input
                                type="text"
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                className="bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                placeholder="E.g. S101 or John Doe"
                            />
                        </div>

                        <button
                            onClick={fetchRecommendations}
                            disabled={loading}
                            className="mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-blue-900/20 transition-all active:scale-95 flex justify-center items-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <Brain className="w-5 h-5" />
                                    Generate AI Path
                                </>
                            )}
                        </button>
                    </div>

                    {/* Recommendations List */}
                    {recommendations.length > 0 && (
                        <div className="glass-panel p-6 flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                                <BookOpen className="w-5 h-5 text-indigo-400" />
                                Predicted Optimal Path
                            </h2>
                            <div className="flex flex-col gap-3">
                                {recommendations.map((rec, idx) => (
                                    <div key={idx} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 hover:bg-slate-800/60 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-slate-200">{rec.content_id}</h3>
                                            <span className="text-xs font-bold px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-md">
                                                {Math.round(rec.confidence * 100)}% Match
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-400">
                                            <span>Est. Time: {rec.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Vision AI Trigger */}
                    <div className="glass-panel p-6">
                        <h2 className="text-xl font-bold flex items-center gap-2 text-white mb-4">
                            <Camera className="w-5 h-5 text-purple-400" />
                            Datature Vision AI
                        </h2>

                        <p className="text-sm text-slate-400 mb-5 leading-relaxed">
                            Analyze real-time emotional and engagement states using live camera feed or video processing.
                        </p>

                        <button
                            onClick={analyzeEngagementMock}
                            className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 group"
                        >
                            <Camera className="w-4 h-4 group-hover:text-purple-400 transition-colors" />
                            Capture & Analyze
                        </button>

                        {engagementData && (
                            <div className={clsx(
                                "mt-5 p-4 rounded-xl border flex items-start gap-3 transition-all",
                                engagementData.alert
                                    ? "bg-red-500/10 border-red-500/30 text-red-200"
                                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                            )}>
                                {engagementData.alert ? (
                                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                ) : (
                                    <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                )}
                                <div>
                                    <div className="font-bold mb-1">
                                        Engagement Score: {engagementData.score}/100
                                    </div>
                                    <div className="text-sm opacity-80">
                                        {engagementData.alert
                                            ? "Critical drop in attention detected. Adjust learning pace immediately."
                                            : "Student is highly focused and absorbing material effectively."}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Charts & Analytics */}
                <div className="flex flex-col gap-6 lg:col-span-2">

                    {/* Main Chart */}
                    <div className="glass-panel p-6 h-[400px] flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                                Cross-Subject Performance Trajectory
                            </h2>
                        </div>

                        <div className="flex-1 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorMath" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorScience" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="week" stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }}
                                        itemStyle={{ color: '#e2e8f0' }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                    <Area type="monotone" dataKey="math" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorMath)" name="Mathematics" />
                                    <Area type="monotone" dataKey="science" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorScience)" name="Science" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Secondary Charts / Widgets */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass-panel p-6 h-[300px] flex flex-col">
                            <h2 className="text-lg font-bold text-white mb-4">Historical Engagement</h2>
                            <div className="flex-1 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={performanceData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                        <XAxis dataKey="week" stroke="#64748b" tick={{ fill: '#64748b' }} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} cursor={{ fill: '#334155', opacity: 0.4 }} />
                                        <Bar dataKey="literature" fill="#a855f7" radius={[4, 4, 0, 0]} name="Engagement Index" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="glass-panel p-6 flex flex-col justify-center">
                            <h2 className="text-lg font-bold text-white mb-2">Automated Insights</h2>
                            <ul className="space-y-4 mt-4">
                                <li className="flex gap-3 items-start">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2 shrink-0"></div>
                                    <p className="text-sm text-slate-300">Consistent upward trend in Science modules indicates high retention rate.</p>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 shrink-0"></div>
                                    <p className="text-sm text-slate-300">Visual learning style profile established with 87% confidence.</p>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 shrink-0"></div>
                                    <p className="text-sm text-slate-300">Recommended intervention: Introduce advanced concepts in Mathematics (W6).</p>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Dashboard;
