import React, { useState } from 'react';
import Lottie from 'lottie-react';
import robotAnimation from '../../AI Robo/chatbot.json';

const EcoBot = ({ onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleNav = (destination) => {
        if (onNavigate) {
            // Map the chip actions to the page names expected by App.jsx
            const pageMap = {
                'Dashboard': 'home',
                'Add Device': 'log-activity', // Assuming this maps to log-activity or similar, otherwise default to home
                'Profile': 'profile'
            };
            const page = pageMap[destination] || 'home';
            onNavigate(page);
            setIsOpen(false); // Close chat on navigation
        }
    };

    return (
        <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-4">

            {/* Chat Window */}
            {isOpen && (
                <div className="mb-2 w-80 rounded-2xl bg-white shadow-xl overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
                    {/* Header */}
                    <div className="flex items-center justify-between bg-green-600 px-4 py-3 text-white">
                        <span className="font-semibold text-sm">EcoBot Assistant 🤖</span>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="hover:bg-green-700 rounded-full p-1 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-4 space-y-4">
                        <div className="flex gap-2">
                            <div className="bg-gray-100 rounded-lg rounded-tl-none p-3 text-sm text-gray-700">
                                Hi! I'm EcoBot. How can I help you navigate?
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex flex-wrap gap-2">
                            {[
                                { label: 'Navigate to Dashboard', action: 'Dashboard' },
                                { label: 'Add Device', action: 'Add Device' },
                                { label: 'My Profile', action: 'Profile' }
                            ].map((chip) => (
                                <button
                                    key={chip.label}
                                    onClick={() => handleNav(chip.action)}
                                    className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-100 transition-colors border border-green-100"
                                >
                                    {chip.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-100 p-3 flex gap-2">
                        <input
                            type="text"
                            placeholder="Ask me anything..."
                            className="flex-1 rounded-full bg-gray-50 px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-green-500"
                        />
                        <button className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Robot Avatar */}
            <div
                className="relative group cursor-pointer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={() => setIsOpen(!isOpen)}
            >
                {/* Tooltip */}
                <div
                    className={`absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-800 px-3 py-1.5 text-xs text-white opacity-0 transition-opacity duration-200 pointer-events-none ${isHovered ? 'opacity-100' : ''}`}
                >
                    Need Help?
                    {/* Tooltip Arrow */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                </div>

                {/* Lottie Animation */}
                <div className="w-20 transition-transform duration-300 hover:scale-110 drop-shadow-lg">
                    <Lottie animationData={robotAnimation} loop={true} />
                </div>
            </div>

        </div>
    );
};

export default EcoBot;
