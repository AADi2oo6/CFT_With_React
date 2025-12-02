import React, { useState } from 'react';

const LogActivity = () => {
    const [activeTab, setActiveTab] = useState('travel');
    const [formData, setFormData] = useState({
        travel: { mode: '', distance: '' },
        energy: { source: 'manual', usage: '', plugStatus: 'disconnected' }, // plugStatus: disconnected, searching, connected
        food: { mealType: '', dietType: '', quantity: '1', unit: 'serving' },
        purchase: { category: '', amount: '' },
        waste: { type: '', weight: '' }
    });

    const handleInputChange = (category, field, value) => {
        setFormData(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: value
            }
        }));
    };

    const handlePlugAction = (action) => {
        if (action === 'find') {
            setFormData(prev => ({ ...prev, energy: { ...prev.energy, plugStatus: 'searching' } }));
            setTimeout(() => {
                setFormData(prev => ({ ...prev, energy: { ...prev.energy, plugStatus: 'connected' } }));
            }, 2000);
        } else if (action === 'disconnect') {
            setFormData(prev => ({ ...prev, energy: { ...prev.energy, plugStatus: 'disconnected' } }));
        }
    };

    const dummyHistory = [
        { id: 1, category: 'transport', description: 'Commute to work (Bus)', date: '2025-12-02', footprint: '2.5' },
        { id: 2, category: 'energy', description: 'Smart Plug Usage', date: '2025-12-01', footprint: '1.2' },
        { id: 3, category: 'food', description: 'Vegetarian Lunch', date: '2025-12-01', footprint: '0.8' },
        { id: 4, category: 'waste', description: 'Recycled Paper', date: '2025-11-30', footprint: '-0.5' },
    ];

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'transport': return { icon: 'fas fa-car', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' };
            case 'energy': return { icon: 'fas fa-bolt', color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' };
            case 'food': return { icon: 'fas fa-utensils', color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' };
            case 'consumption': return { icon: 'fas fa-shopping-cart', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' };
            case 'waste': return { icon: 'fas fa-recycle', color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' };
            default: return { icon: 'fas fa-leaf', color: 'bg-teal-100 text-teal-600' };
        }
    };

    const renderTabButton = (id, label, iconClass) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${activeTab === id
                ? 'bg-teal-500 text-white shadow-lg transform scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
        >
            <i className={iconClass}></i>
            {label}
        </button>
    );

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

            {/* Stats Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Today's Emissions</h3>
                    <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">0 <span className="text-sm font-normal text-gray-500">kg CO₂e</span></p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Yesterday's Emissions</h3>
                    <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">0 <span className="text-sm font-normal text-gray-500">kg CO₂e</span></p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">This Month</h3>
                    <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">0 <span className="text-sm font-normal text-gray-500">kg CO₂e</span></p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Last Month</h3>
                    <p className="text-3xl font-bold text-green-500">348.99 <span className="text-sm font-normal text-gray-500">kg CO₂e</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">Daily Budget</h3>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                        <div className="bg-teal-500 h-4 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Used 0 of 15 kg</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-4">Monthly Budget</h3>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                        <div className="bg-teal-500 h-4 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Used 0 of 450 kg</p>
                </div>
            </div>

            {/* Header */}
            <div className="text-center space-y-2 pt-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Log Your Activity</h1>
                <p className="text-gray-500 dark:text-gray-400">Add your daily activities to track your carbon footprint and see your impact.</p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-4">
                {renderTabButton('travel', 'Travel', 'fas fa-car')}
                {renderTabButton('energy', 'Energy', 'fas fa-bolt')}
                {renderTabButton('food', 'Food', 'fas fa-utensils')}
                {renderTabButton('purchase', 'Purchases', 'fas fa-shopping-cart')}
                {renderTabButton('waste', 'Waste', 'fas fa-recycle')}
            </div>

            {/* Main Form Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 transition-colors">

                {/* Travel Form */}
                {activeTab === 'travel' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mode of Transport</label>
                            <select
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                value={formData.travel.mode}
                                onChange={(e) => handleInputChange('travel', 'mode', e.target.value)}
                            >
                                <option value="">Choose...</option>
                                <option value="car-gasoline">Car (Gasoline)</option>
                                <option value="car-electric">Car (Electric)</option>
                                <option value="bus">Bus</option>
                                <option value="train">Train / Metro</option>
                                <option value="motorcycle">Motorcycle</option>
                                <option value="bicycle">Bicycle</option>
                                <option value="walking">Walking</option>
                                <option value="flight-short">Flight (Short-haul)</option>
                                <option value="flight-long">Flight (Long-haul)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Distance Traveled</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                    placeholder="e.g., 25"
                                    value={formData.travel.distance}
                                    onChange={(e) => handleInputChange('travel', 'distance', e.target.value)}
                                />
                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">km</span>
                            </div>
                        </div>
                        <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2">
                            <i className="fas fa-plus-circle"></i>
                            Log Travel
                        </button>
                    </div>
                )}

                {/* Energy Form */}
                {activeTab === 'energy' && (
                    <div className="space-y-6 animate-fadeIn">
                        <h5 className="font-bold text-gray-800 dark:text-white mb-3">Smart Plug Integration</h5>

                        {/* Disconnected State */}
                        {formData.energy.plugStatus === 'disconnected' && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-xl p-6 flex items-start gap-4">
                                <div className="p-3 bg-red-100 dark:bg-red-800/40 rounded-full text-red-600 dark:text-red-400">
                                    <i className="fas fa-plug text-xl"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-red-800 dark:text-red-300">Smart Plug Disconnected</h3>
                                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">Click below to search for your device.</p>
                                    <button
                                        onClick={() => handlePlugAction('find')}
                                        className="mt-3 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <i className="fas fa-search"></i>
                                        Find My Plug
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Searching State */}
                        {formData.energy.plugStatus === 'searching' && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800/30 rounded-xl p-6 flex items-start gap-4">
                                <div className="p-3 bg-yellow-100 dark:bg-yellow-800/40 rounded-full text-yellow-600 dark:text-yellow-400">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-yellow-800 dark:text-yellow-300">Searching for Smart Plug...</h3>
                                    <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">Ensure your device is powered on and nearby.</p>
                                </div>
                            </div>
                        )}

                        {/* Connected State */}
                        {formData.energy.plugStatus === 'connected' && (
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded-xl p-6">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="p-3 bg-green-100 dark:bg-green-800/40 rounded-full text-green-600 dark:text-green-400">
                                        <i className="fas fa-check-circle text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-green-800 dark:text-green-300">Connected to Smart Plug</h3>
                                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">Live data is being received.</p>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-green-100 dark:border-green-800/30 flex items-center justify-between mb-4">
                                    <span className="text-gray-600 dark:text-gray-400">Current Consumption</span>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold text-gray-800 dark:text-white">1.25</span>
                                        <span className="text-sm text-gray-500 ml-1">kWh</span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button className="flex-1 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                                        <i className="fas fa-sync-alt"></i>
                                        Sync Now
                                    </button>
                                    <button
                                        onClick={() => handlePlugAction('disconnect')}
                                        className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                                    >
                                        <i className="fas fa-times-circle"></i>
                                        Disconnect
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="text-center pt-4 border-t border-gray-100 dark:border-gray-700">
                            <p className="text-sm text-gray-500 mb-4">Or, enter electricity data manually</p>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">Electricity Consumed</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                            placeholder="e.g., 150"
                                            value={formData.energy.usage}
                                            onChange={(e) => handleInputChange('energy', 'usage', e.target.value)}
                                        />
                                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">kWh</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1 text-left">Enter the units from your monthly electricity bill.</p>
                                </div>
                                <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2">
                                    <i className="fas fa-plus-circle"></i>
                                    Log Energy
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Food Form */}
                {activeTab === 'food' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Meal Type</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                    value={formData.food.mealType}
                                    onChange={(e) => handleInputChange('food', 'mealType', e.target.value)}
                                >
                                    <option value="">Choose...</option>
                                    <option value="breakfast">Breakfast</option>
                                    <option value="lunch">Lunch</option>
                                    <option value="dinner">Dinner</option>
                                    <option value="snack">Snack</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Primary Diet Type</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                    value={formData.food.dietType}
                                    onChange={(e) => handleInputChange('food', 'dietType', e.target.value)}
                                >
                                    <option value="">Choose...</option>
                                    <option value="red-meat">Red Meat (e.g., beef, lamb)</option>
                                    <option value="white-meat">White Meat (e.g., chicken, pork)</option>
                                    <option value="fish">Fish / Seafood</option>
                                    <option value="vegetarian">Vegetarian</option>
                                    <option value="vegan">Vegan</option>
                                    <option value="other">Other / Mixed</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantity</label>
                            <div className="flex">
                                <input
                                    type="number"
                                    className="flex-1 px-4 py-3 rounded-l-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                    placeholder="e.g., 1"
                                    value={formData.food.quantity}
                                    onChange={(e) => handleInputChange('food', 'quantity', e.target.value)}
                                />
                                <select
                                    className="w-32 px-4 py-3 rounded-r-xl bg-gray-100 dark:bg-gray-800 border border-l-0 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                    value={formData.food.unit}
                                    onChange={(e) => handleInputChange('food', 'unit', e.target.value)}
                                >
                                    <option value="serving">serving(s)</option>
                                    <option value="item">item(s)</option>
                                    <option value="gram">grams</option>
                                    <option value="ounce">ounces</option>
                                </select>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500">Log the main component of your meal to get the best estimate of its carbon footprint.</p>
                        <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2">
                            <i className="fas fa-plus-circle"></i>
                            Log Food
                        </button>
                    </div>
                )}

                {/* Purchase Form */}
                {activeTab === 'purchase' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Purchase Category</label>
                            <select
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                value={formData.purchase.category}
                                onChange={(e) => handleInputChange('purchase', 'category', e.target.value)}
                            >
                                <option value="">Choose...</option>
                                <option value="clothing">Clothing & Apparel</option>
                                <option value="electronics">Electronics</option>
                                <option value="home-goods">Home Goods & Furniture</option>
                                <option value="services">Services</option>
                                <option value="other">Other Goods</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount Spent</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                    placeholder="e.g., 50.00"
                                    value={formData.purchase.amount}
                                    onChange={(e) => handleInputChange('purchase', 'amount', e.target.value)}
                                />
                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">INR</span>
                            </div>
                        </div>
                        <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2">
                            <i className="fas fa-plus-circle"></i>
                            Log Purchase
                        </button>
                    </div>
                )}

                {/* Waste Form */}
                {activeTab === 'waste' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Waste Type</label>
                            <select
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                value={formData.waste.type}
                                onChange={(e) => handleInputChange('waste', 'type', e.target.value)}
                            >
                                <option value="">Choose...</option>
                                <option value="plastic">Plastic</option>
                                <option value="paper">Paper</option>
                                <option value="glass">Glass</option>
                                <option value="metal">Metal</option>
                                <option value="organic">Organic/Compost</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Weight (Approx)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                    placeholder="e.g., 0.5"
                                    value={formData.waste.weight}
                                    onChange={(e) => handleInputChange('waste', 'weight', e.target.value)}
                                />
                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">kg</span>
                            </div>
                        </div>
                        <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2">
                            <i className="fas fa-plus-circle"></i>
                            Log Waste
                        </button>
                    </div>
                )}

            </div>

            {/* Activity History */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 transition-colors">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Activity History</h2>
                </div>

                {/* Filters */}
                <div className="flex gap-4 mb-6">
                    <div className="relative flex-1">
                        <input type="date" className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-teal-500 outline-none" />
                    </div>
                    <div className="relative flex-1">
                        <select className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-teal-500 outline-none">
                            <option value="all">All Categories</option>
                            <option value="transport">Transportation</option>
                            <option value="energy">Energy</option>
                            <option value="food">Food</option>
                            <option value="consumption">Purchases</option>
                            <option value="waste">Waste</option>
                        </select>
                    </div>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl mb-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                    <div className="col-span-4">Category</div>
                    <div className="col-span-4">Description</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-1 text-right">Footprint</div>
                    <div className="col-span-1 text-center">Action</div>
                </div>

                {/* List */}
                <div className="space-y-2">
                    {dummyHistory.map((item) => {
                        const { icon, color } = getCategoryIcon(item.category);
                        return (
                            <div key={item.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-xl transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                                <div className="col-span-4 flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
                                        <i className={icon}></i>
                                    </div>
                                    <span className="font-medium text-gray-800 dark:text-white capitalize">{item.category}</span>
                                </div>
                                <div className="col-span-4 text-gray-600 dark:text-gray-300">{item.description}</div>
                                <div className="col-span-2 text-gray-500 dark:text-gray-400 text-sm">{item.date}</div>
                                <div className={`col-span-1 text-right font-bold ${item.footprint < 0 ? 'text-green-500' : 'text-gray-800 dark:text-white'}`}>
                                    {item.footprint > 0 ? '+' : ''}{item.footprint}
                                </div>
                                <div className="col-span-1 text-center">
                                    <button className="text-red-500 hover:text-red-700 transition-colors">
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default LogActivity;
