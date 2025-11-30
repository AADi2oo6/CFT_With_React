import React from 'react';

const EcoChampions = () => {
    const champions = [
        { rank: 1, user: 'sai@gmail.com', co2: '315.5 kg', reduction: 'N/A' },
        { rank: 2, user: 'aditya', co2: '349.0 kg', reduction: 'N/A' },
        { rank: 3, user: 'chatlaishwar@gmail.com', co2: '845.5 kg', reduction: 'N/A' },
        { rank: 4, user: 'ishwarchatla4@gmail.com', co2: '0.0 kg', reduction: 'N/A' },
    ];

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1:
                return <img src="https://cdn-icons-png.flaticon.com/512/2583/2583344.png" alt="Gold Medal" className="w-6 h-6" />;
            case 2:
                return <img src="https://cdn-icons-png.flaticon.com/512/2583/2583319.png" alt="Silver Medal" className="w-6 h-6" />;
            case 3:
                return <img src="https://cdn-icons-png.flaticon.com/512/2583/2583434.png" alt="Bronze Medal" className="w-6 h-6" />;
            default:
                return <span className="font-bold text-gray-700">{rank}</span>;
        }
    };

    return (
        <section className="py-12 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-center gap-3 mb-8">
                    <img src="https://cdn-icons-png.flaticon.com/512/3112/3112946.png" alt="Trophy" className="w-8 h-8" />
                    <h2 className="text-3xl font-bold text-gray-800">Top Eco Champions</h2>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-4 bg-gray-50 p-4 text-sm font-semibold text-gray-600 border-b border-gray-100">
                        <div>Rank</div>
                        <div>User</div>
                        <div className="text-right">Monthly CO2</div>
                        <div className="text-right">Reduction</div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y divide-gray-50">
                        {champions.map((champ) => (
                            <div key={champ.rank} className="grid grid-cols-4 p-4 items-center hover:bg-gray-50 transition-colors">
                                <div className="pl-2">{getRankIcon(champ.rank)}</div>
                                <div className="text-gray-800 font-medium truncate pr-4">{champ.user}</div>
                                <div className="text-right text-gray-600">{champ.co2}</div>
                                <div className="text-right text-teal-500 font-medium">{champ.reduction}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6">
                    <button className="text-teal-600 font-semibold border border-teal-600 rounded-lg px-6 py-2 hover:bg-teal-50 transition-colors">
                        View Full Leaderboard
                    </button>
                </div>
            </div>
        </section>
    );
};

export default EcoChampions;
