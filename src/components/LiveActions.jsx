import React, { useState, useEffect } from 'react';

const initialActions = [
    { id: 1, user: 'User***12', action: 'carpooled to work', time: 'Just now', icon: '🚗', color: 'bg-red-100 text-red-600' },
    { id: 2, user: 'User***12', action: 'carpooled to work', time: '5min ago', icon: '🚗', color: 'bg-red-100 text-red-600' },
    { id: 3, user: 'User***91', action: 'used public transport', time: '8min ago', icon: '🚌', color: 'bg-blue-100 text-blue-600' },
    { id: 4, user: 'User***45', action: 'switched to LED bulbs', time: '11min ago', icon: '💡', color: 'bg-yellow-100 text-yellow-600' },
];

const newActionsSource = [
    { action: 'planted a tree', icon: '🌳', color: 'bg-green-100 text-green-600' },
    { action: 'recycled plastic', icon: '♻️', color: 'bg-teal-100 text-teal-600' },
    { action: 'used a reusable bag', icon: '🛍️', color: 'bg-purple-100 text-purple-600' },
    { action: 'biked to work', icon: '🚲', color: 'bg-orange-100 text-orange-600' },
];

const LiveActions = () => {
    const [actions, setActions] = useState(initialActions);

    useEffect(() => {
        const interval = setInterval(() => {
            const randomAction = newActionsSource[Math.floor(Math.random() * newActionsSource.length)];
            const newAction = {
                id: Date.now(),
                user: `User***${Math.floor(Math.random() * 90) + 10}`,
                action: randomAction.action,
                time: 'Just now',
                icon: randomAction.icon,
                color: randomAction.color
            };

            setActions(prev => [newAction, ...prev.slice(0, 4)]);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-12 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse"></div>
                    <h2 className="text-3xl font-bold text-gray-800">Live Community Actions</h2>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6 shadow-inner h-[400px] overflow-hidden relative">
                    <div className="space-y-4">
                        {actions.map((item, index) => (
                            <div
                                key={item.id}
                                className={`flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100 ${index === 0 ? 'animate-slide-down' : ''}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${item.color}`}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p className="text-gray-800 font-medium">
                                            <span className="font-semibold">{item.user}</span> {item.action}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400 font-medium">{item.time}</span>
                            </div>
                        ))}
                    </div>

                    {/* Gradient Overlay for bottom fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
                </div>

                <div className="mt-6">
                    <button className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                        Join the Movement!
                    </button>
                </div>
            </div>
        </section>
    );
};

export default LiveActions;
