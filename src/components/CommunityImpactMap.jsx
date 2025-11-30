import { useState } from 'react';

const CommunityImpactMap = () => {
    const [activeTab, setActiveTab] = useState('population');

    return (
        <section className="py-16 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Community Impact Map</h2>
                <p className="text-center text-gray-600 max-w-3xl mx-auto mb-8">
                    Explore the geographical distribution of our eco-conscious community. This interactive heatmap visualizes registered user density and regional average carbon emission footprints, offering insights into our collective environmental impact.
                </p>

                {/* Controls Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    {/* Toggle Buttons */}
                    <div className="bg-gray-100 p-1 rounded-lg inline-flex shadow-inner">
                        <button
                            onClick={() => setActiveTab('population')}
                            className={`px-6 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${activeTab === 'population'
                                ? 'bg-teal-500 text-white shadow-sm'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                                }`}
                        >
                            By Population
                        </button>
                        <button
                            onClick={() => setActiveTab('emission')}
                            className={`px-6 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${activeTab === 'emission'
                                ? 'bg-teal-500 text-white shadow-sm'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                                }`}
                        >
                            By Emission
                        </button>
                    </div>

                    {/* Zoom Button */}
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-teal-500 text-teal-600 rounded-lg hover:bg-teal-50 transition-colors font-medium shadow-sm group">
                        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Zoom to My Location
                    </button>
                </div>

                {/* Map Container (Loading State) */}
                <div className="w-full h-[600px] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center relative overflow-hidden group">

                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                        }}>
                    </div>

                    {/* Loading Content */}
                    <div className="flex flex-col items-center z-10 p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100">
                        <div className="relative mb-6">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Loading Community Map...</h3>
                        <p className="text-gray-500 text-center max-w-xs">
                            Connecting to geospatial server to retrieve {activeTab === 'population' ? 'population' : 'emission'} data...
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CommunityImpactMap;
