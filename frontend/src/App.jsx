import React from 'react';
import Dashboard from './Dashboard';

function App() {
    return (
        <div className="min-h-screen bg-[#020817] relative overflow-hidden">
            {/* Decorative background blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/30 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

            <main className="relative z-10 w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
                <Dashboard />
            </main>
        </div>
    );
}

export default App;
