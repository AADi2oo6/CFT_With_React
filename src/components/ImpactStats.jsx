import React from 'react';

const StatCard = ({ icon, value, unit, label, subLabel, isImprovement, isRank }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 text-2xl transition-colors duration-300 ${isImprovement ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : isRank ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400'}`}>
            {icon}
        </div>
        <div className="text-3xl font-bold text-gray-800 dark:text-white mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            {value}
        </div>
        {unit && <div className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">{unit}</div>}
        <div className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</div>
        {subLabel && <div className={`text-xs mt-1 ${isImprovement ? 'text-green-500 dark:text-green-400 font-bold' : 'text-gray-400 dark:text-gray-500'}`}>{subLabel}</div>}
    </div>
);

const ImpactStats = () => {
    const [stats, setStats] = React.useState({
        thisMonth: 0,
        lastMonth: 0,
        improvement: 0
    });

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user') || '{}');
                let url = 'http://127.0.0.1:8000/api/dashboard-stats/';
                if (user.email) {
                    url += `?email=${user.email}`;
                }
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    const thisMonth = data.emission_stats.this_month;
                    const lastMonth = data.emission_stats.last_month;

                    let improvement = 0;
                    if (lastMonth > 0) {
                        improvement = ((lastMonth - thisMonth) / lastMonth) * 100;
                    } else if (thisMonth > 0) {
                        improvement = -100; // If last month was 0 and this month > 0, it's a decrease in performance (negative improvement)
                    }

                    setStats({
                        thisMonth,
                        lastMonth,
                        improvement
                    });
                }
            } catch (error) {
                console.error('Error fetching impact stats:', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div>
            <h2 className="text-3xl font-bold text-teal-800 dark:text-teal-400 mb-8 text-center transition-colors duration-300">Your Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<i className="fas fa-leaf"></i>}
                    value={stats.thisMonth}
                    unit="kg CO2e"
                    label="Your Footprint"
                    subLabel="(This Month)"
                />
                <StatCard
                    icon={<i className="fas fa-chart-line"></i>}
                    value={stats.lastMonth}
                    unit="kg CO2e"
                    label="vs. Last Month"
                />
                <StatCard
                    icon={<i className={`fas fa-arrow-${stats.improvement >= 0 ? 'down' : 'up'}`}></i>}
                    value={`${stats.improvement >= 0 ? '↓' : '↑'} ${Math.abs(stats.improvement).toFixed(1)}%`}
                    label="Monthly Improvement"
                    isImprovement={stats.improvement >= 0}
                    subLabel={stats.improvement >= 0 ? "Reduction" : "Increase"}
                />
                <StatCard
                    icon={<i className="fas fa-trophy"></i>}
                    value="#2"
                    label="Community Rank"
                    isRank={true}
                />
            </div>
        </div>
    );
};

export default ImpactStats;
