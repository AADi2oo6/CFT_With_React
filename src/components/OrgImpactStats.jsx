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

const OrgImpactStats = () => {
    // Dummy Data for Organization Dashboard
    const stats = {
        totalMembers: 124,
        co2Saved: 850, // kg
        orgRank: 5,
        monthlyImprovement: 12 // %
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-teal-800 dark:text-teal-400 mb-8 text-center transition-colors duration-300">Our Impact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<i className="fas fa-users"></i>}
                    value={stats.totalMembers}
                    label="Total Members"
                    subLabel="Active Users"
                />
                <StatCard
                    icon={<i className="fas fa-leaf"></i>}
                    value={stats.co2Saved}
                    unit="kg CO2e"
                    label="Total CO2 Saved"
                    subLabel="Collective Impact"
                />
                <StatCard
                    icon={<i className="fas fa-trophy"></i>}
                    value={`#${stats.orgRank}`}
                    label="Organization Rank"
                    isRank={true}
                />
                <StatCard
                    icon={<i className="fas fa-arrow-down"></i>}
                    value={`↓ ${stats.monthlyImprovement}%`}
                    label="Monthly Improvement"
                    isImprovement={true}
                    subLabel="Reduction"
                />
            </div>
        </div>
    );
};

export default OrgImpactStats;
