import React, { useState } from 'react';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Brush } from 'recharts';

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

    // Energy Forecast & Demo Mode State
    const [energyForecast, setEnergyForecast] = useState(null);
    const [loadingForecast, setLoadingForecast] = useState(false);

    // Live Monitoring States
    const [connectionStatus, setConnectionStatus] = useState('disconnected'); // disconnected, searching, connecting, live
    const [liveDataPoints, setLiveDataPoints] = useState([]);
    const [currentTime, setCurrentTime] = useState(null); // Real "Now"
    const [simulationTick, setSimulationTick] = useState(0);
    const [activeDevices, setActiveDevices] = useState({ bulb: false, iron: false });
    const [liveStats, setLiveStats] = useState({ energy: 0, emissions: 0 });

    // Add Devices State
    const [showAddDevice, setShowAddDevice] = useState(false);
    const [newDevice, setNewDevice] = useState({ name: '', power: '' });
    const [customDevices, setCustomDevices] = useState([]);

    const fetchEnergyForecast = async () => {
        setLoadingForecast(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/energy-forecast/`);
            if (response.ok) {
                const data = await response.json();
                setEnergyForecast(data);

                // Initialize Current Time from Server or Client
                setCurrentTime(new Date());
                setLiveDataPoints([]); // Reset live points on fresh fetch
            }
        } catch (error) {
            console.error('Error fetching energy forecast:', error);
        } finally {
            setLoadingForecast(false);
        }
    };

    const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);

    // Live Data Injection Effect
    React.useEffect(() => {
        let interval;
        let offlineTimeout;
        if (connectionStatus === 'live' && energyForecast) {

            setIsSimulatedOffline(true);
            setActiveDevices({ bulb: false, iron: false });
            setCurrentTime(new Date());

            // Poll the backend API every 10 seconds (Simulated)
            offlineTimeout = setTimeout(() => {
                setIsSimulatedOffline(false);

                const generateMockData = () => {
                    const now = new Date();
                    setCurrentTime(now);

                    const power = Math.floor(Math.random() * (13 - 8 + 1)) + 8; // Random between 8 and 13

                    // Update Bulb status dynamically based on if it's drawing power
                    let devices = { bulb: true, iron: false };
                    setActiveDevices(devices);

                    // Calculate Live Stats
                    // EnergyIncrement (Wh) = Power (W) * (10s / 3600s/h)
                    const energyIncrementWh = power * (10 / 3600);
                    // EmissionsIncrement (kgCO2) = Energy (kWh) * 0.82
                    const emissionsIncrementKg = (energyIncrementWh / 1000) * 0.82;

                    setLiveStats(prev => ({
                        energy: prev.energy + energyIncrementWh,
                        emissions: prev.emissions + emissionsIncrementKg
                    }));

                    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

                    setLiveDataPoints(prevPoints => {
                        const newPoint = {
                            display_time: timeStr,
                            power: parseFloat(power.toFixed(2)),
                            type: 'live'
                        };
                        // Keep last 30 points (5 minutes of data at 10s intervals)
                        if (prevPoints.length > 30) return [...prevPoints.slice(1), newPoint];
                        return [...prevPoints, newPoint];
                    });
                };

                generateMockData();
                interval = setInterval(generateMockData, 10000);

            }, 5000);

        } else {
            setIsSimulatedOffline(false);
            setActiveDevices({ bulb: false, iron: false });
            setLiveStats({ energy: 0, emissions: 0 });
        }

        return () => {
            if (interval) clearInterval(interval);
            if (offlineTimeout) clearTimeout(offlineTimeout);
        };
    }, [connectionStatus, energyForecast]);


    const handlePlugAction = (action) => {
        if (action === 'find') {
            // Transition Flow
            setConnectionStatus('searching');
            setFormData(prev => ({ ...prev, energy: { ...prev.energy, plugStatus: 'searching' } }));

            setTimeout(() => {
                setConnectionStatus('connecting');
            }, 2000);

            setTimeout(() => {
                setConnectionStatus('live');
                setFormData(prev => ({ ...prev, energy: { ...prev.energy, plugStatus: 'connected' } }));
                fetchEnergyForecast(); // Fetch History + Forecast
            }, 4000); // 2s searching + 2s connecting

        } else if (action === 'disconnect') {
            setConnectionStatus('disconnected');
            setFormData(prev => ({ ...prev, energy: { ...prev.energy, plugStatus: 'disconnected' } }));
            setEnergyForecast(null);
            setLiveDataPoints([]);
        }
    };

    // ... (rest of the component logic) ...

    // Render Logic for Energy Tab
    // ...

    {/* Connected State - Digital Twin Dashboard */ }
    {
        formData.energy.plugStatus === 'connected' && (
            <div className="bg-white dark:bg-gray-900 border border-teal-100 dark:border-teal-900/50 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-teal-100 dark:bg-teal-900/40 rounded-full text-teal-600 dark:text-teal-400 animate-pulse">
                            <i className="fas fa-microchip text-xl"></i>
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-gray-800 dark:text-white">Digital Twin Monitor</h3>
                            <p className="text-sm text-teal-600 dark:text-teal-400 font-medium">Real-time IoT & AI Forecast</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">Status</div>
                        {energyForecast?.status === 'offline' ? (
                            <div className="text-red-500 font-bold flex items-center justify-end gap-1">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                Offline
                            </div>
                        ) : (
                            <div className="text-green-500 font-bold flex items-center justify-end gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                                Online
                            </div>
                        )}
                    </div>
                </div>

                {loadingForecast || !energyForecast ? (
                    <div className="h-64 flex items-center justify-center text-gray-400 flex-col gap-2">
                        <i className="fas fa-circle-notch fa-spin text-3xl text-teal-500"></i>
                        <p>Syncing with Digital Twin...</p>
                    </div>
                ) : (
                    <>
                        {/* Offline Alert */}
                        {energyForecast.status === 'offline' && (
                            <div className="mb-6 p-4 rounded-xl bg-orange-50 border border-orange-100 text-orange-800 flex items-start gap-3">
                                <i className="fas fa-exclamation-triangle mt-1 text-lg"></i>
                                <div>
                                    <span className="font-bold block text-sm opacity-80">Device Offline</span>
                                    Switching to AI Forecast Mode (LSTM). Displaying predicted usage based on historical patterns.
                                </div>
                            </div>
                        )}

                        {/* Chart */}
                        <div className="h-64 w-full mb-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={[...energyForecast.history, ...energyForecast.forecast]} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                    <XAxis
                                        dataKey="time"
                                        stroke="#9ca3af"
                                        tick={{ fontSize: 12 }}
                                        interval={4}
                                    />
                                    <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                        labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                                    />

                                    <ReferenceLine x="20:00" stroke="#f97316" strokeDasharray="3 3" label={{ value: 'Live Data Ends', position: 'top', fill: '#f97316', fontSize: 10 }} />

                                    {/* History Line (Blue, Solid) */}
                                    <Line
                                        type="monotone"
                                        dataKey="power"
                                        data={energyForecast.history}
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        dot={false}
                                        name="Actual Power (W)"
                                        activeDot={{ r: 6 }}
                                    />

                                    {/* Forecast Line (Green, Dashed) */}
                                    <Line
                                        type="monotone"
                                        dataKey="power"
                                        data={energyForecast.forecast}
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        strokeDasharray="5 5"
                                        dot={false}
                                        name="Predicted Power (W)"
                                    />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                <div className="text-gray-500 text-xs font-bold uppercase mb-1">Avg Usage (Last 12h)</div>
                                <div className="text-2xl font-bold text-gray-800 dark:text-white">
                                    {energyForecast.stats.avg_usage}
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                <div className="text-gray-500 text-xs font-bold uppercase mb-1">Predicted Carbon</div>
                                <div className="text-2xl font-bold text-teal-600">
                                    {energyForecast.stats.predicted_carbon}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={fetchEnergyForecast}
                                className="flex-1 px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <i className="fas fa-sync-alt"></i>
                                Refresh Data
                            </button>
                            <button
                                onClick={() => handlePlugAction('disconnect')}
                                className="flex-1 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <i className="fas fa-power-off"></i>
                                Disconnect
                            </button>
                        </div>
                    </>
                )}
            </div>
        )
    }

    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [filters, setFilters] = useState({ date: '', category: 'all' });

    const fetchActivities = async () => {
        setLoadingHistory(true);
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            let url = `${import.meta.env.VITE_API_URL}/log-activity/`;
            const params = new URLSearchParams();

            if (user.email) params.append('email', user.email);
            if (filters.date) params.append('date', filters.date);
            if (filters.category !== 'all') params.append('category', filters.category);

            const response = await fetch(`${url}?${params.toString()}`);
            if (response.ok) {
                const data = await response.json();
                setHistory(data);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoadingHistory(false);
        }
    };

    React.useEffect(() => {
        fetchActivities();
    }, [filters]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this activity?')) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/log-activity/${id}/`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setHistory(prev => prev.filter(item => item.id !== id));
                setMessage({ type: 'success', text: 'Activity deleted successfully.' });
            } else {
                throw new Error('Failed to delete');
            }
        } catch (error) {
            console.error('Error deleting activity:', error);
            setMessage({ type: 'error', text: 'Failed to delete activity.' });
        }
    };

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

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleSubmit = async (category) => {
        setLoading(true);
        setMessage({ type: '', text: '' });

        // Map frontend categories to backend model categories
        let formCategory = category;
        let apiCategory = category;

        if (category === 'consumption') {
            formCategory = 'purchase'; // Frontend state uses 'purchase'
            apiCategory = 'consumption'; // Backend expects 'consumption'
        } else if (category === 'travel') {
            formCategory = 'travel'; // Frontend state uses 'travel'
            apiCategory = 'transport'; // Backend expects 'transport'
        }

        const data = {
            ...formData[formCategory],
            category: apiCategory
        };

        if (category === 'consumption') {
            data.purchaseCategory = formData.purchase.category;
        }

        try {
            const token = localStorage.getItem('token'); // Assuming token is stored here
            // Note: In the current setup, we might rely on session auth or the dummy token. 
            // If using the dummy token from LoginView, we need to send it.
            // However, the backend view currently checks request.user or email.
            // Let's assume we send the email if not authenticated, or rely on session.
            // For now, I'll try to send the email from localStorage if available, or just rely on the backend handling.

            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.email) {
                data.email = user.email;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/log-activity/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Token ${token}` // Uncomment if using Token auth
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Backend error:', errorData);
                let errorMessage = 'Failed to log activity.';
                if (typeof errorData === 'object') {
                    const firstKey = Object.keys(errorData)[0];
                    const firstError = errorData[firstKey];
                    if (Array.isArray(firstError)) {
                        errorMessage = `${firstKey}: ${firstError[0]}`;
                    } else if (typeof firstError === 'string') {
                        errorMessage = firstError;
                    } else {
                        errorMessage = JSON.stringify(errorData);
                    }
                }
                throw new Error(errorMessage);
            }

            const result = await response.json();
            setMessage({ type: 'success', text: `Successfully logged ${category} activity! (+${result.carbon_footprint_kg} kg CO2)` });
            fetchActivities();

            // Reset form for this category
            setFormData(prev => ({
                ...prev,
                [formCategory]: { ...prev[formCategory] } // You might want to reset specific fields here
            }));

        } catch (error) {
            console.error('Error logging activity:', error);
            setMessage({ type: 'error', text: error.message || 'Failed to log activity. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const [stats, setStats] = useState({
        emission_stats: { today: 0, yesterday: 0, this_month: 0, last_month: 0 },
        budget: { daily_limit: 15, daily_used: 0, monthly_limit: 450, monthly_used: 0 }
    });

    const fetchStats = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            let url = `${import.meta.env.VITE_API_URL}/dashboard-stats/`;
            if (user.email) {
                url += `?email=${user.email}`;
            }
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    React.useEffect(() => {
        fetchStats();
    }, [history]); // Refresh stats when history changes (i.e., after logging/deleting)

    // ── Gamification state (seeded from API) ────────────────────────
    const [gamificationStats, setGamificationStats] = useState(null);
    const [xp, setXp] = useState(0);
    const [ecoCoins, setEcoCoins] = useState(0);
    const [penaltyToast, setPenaltyToast] = useState(null);
    const penaltyApplied = React.useRef({ daily: false, monthly: false });

    // Fetch real gamification data from /api/gamification-stats/
    const fetchGamificationStats = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            // Hardcode email fallback for demo; normally read from localStorage
            const email = user.email || 'adishahil346@gmail.com';
            const url = `${import.meta.env.VITE_API_URL}/gamification-stats/?email=${encodeURIComponent(email)}`;
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                // API wraps data under 'user_stats' key
                const stats = data.user_stats;
                if (stats) {
                    setGamificationStats(stats);
                    setXp(stats.xp ?? 0);
                    setEcoCoins(stats.eco_coins ?? 0);
                }
            } else {
                console.error('Gamification stats fetch failed:', res.status);
            }
        } catch (err) {
            console.error('Error fetching gamification stats:', err);
        }
    };

    React.useEffect(() => {
        fetchGamificationStats();
    }, []);

    // Runs whenever budget stats update — applies XP/EcoCoin penalties once per overrun
    React.useEffect(() => {
        const { daily_limit, daily_used, monthly_limit, monthly_used } = stats.budget;

        if (daily_used > daily_limit && !penaltyApplied.current.daily) {
            penaltyApplied.current.daily = true;
            setXp(prev => Math.max(0, prev - 10));
            setEcoCoins(prev => Math.max(0, prev - 2));
            setPenaltyToast({ xp: -10, coins: -2, reason: 'Daily budget exceeded!' });
            setTimeout(() => setPenaltyToast(null), 4000);
        } else if (daily_used <= daily_limit) {
            penaltyApplied.current.daily = false;
        }

        if (monthly_used > monthly_limit && !penaltyApplied.current.monthly) {
            penaltyApplied.current.monthly = true;
            setXp(prev => Math.max(0, prev - 50));
            setEcoCoins(prev => Math.max(0, prev - 10));
            setPenaltyToast({ xp: -50, coins: -10, reason: 'Monthly budget exceeded!' });
            setTimeout(() => setPenaltyToast(null), 4000);
        } else if (monthly_used <= monthly_limit) {
            penaltyApplied.current.monthly = false;
        }
    }, [stats.budget]);

    // ── Budget helper ────────────────────────────────────────────────
    const getBudgetMeta = (used, limit) => {
        const pct = limit > 0 ? (used / limit) * 100 : 0;
        if (pct >= 100) return { pct, barColor: 'bg-red-500',    label: 'text-red-600 dark:text-red-400',    badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',    status: 'OVER LIMIT', remaining: `${(used - limit).toFixed(1)} kg OVER budget!` };
        if (pct >= 75)  return { pct, barColor: 'bg-amber-400',  label: 'text-amber-600 dark:text-amber-400', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', status: 'WARNING',    remaining: `${(limit - used).toFixed(1)} kg remaining` };
        return              { pct, barColor: 'bg-emerald-500', label: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', status: 'GOOD',   remaining: `${(limit - used).toFixed(1)} kg remaining` };
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

            {/* Message Alert */}
            {message.text && (
                <div className={`p-4 rounded-xl ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            {/* Stats Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Today's Emissions</h3>
                    <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">{stats.emission_stats.today} <span className="text-sm font-normal text-gray-500">kg CO₂e</span></p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Yesterday's Emissions</h3>
                    <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">{stats.emission_stats.yesterday} <span className="text-sm font-normal text-gray-500">kg CO₂e</span></p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">This Month</h3>
                    <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">{stats.emission_stats.this_month} <span className="text-sm font-normal text-gray-500">kg CO₂e</span></p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">Last Month</h3>
                    <p className="text-3xl font-bold text-green-500">{stats.emission_stats.last_month} <span className="text-sm font-normal text-gray-500">kg CO₂e</span></p>
                </div>
            </div>

            {/* ── Penalty Toast ───────────────────────────────────────── */}
            {penaltyToast && (
                <div className="fixed top-6 right-6 z-50 animate-bounce">
                    <div className="bg-red-600 text-white px-5 py-4 rounded-2xl shadow-2xl border border-red-400 flex items-start gap-3 max-w-xs">
                        <span className="text-2xl">⚠️</span>
                        <div>
                            <p className="font-bold text-sm">{penaltyToast.reason}</p>
                            <p className="text-xs mt-1 opacity-90">{penaltyToast.xp} XP &nbsp;|&nbsp; {penaltyToast.coins} EcoCoins</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Budget Cards ────────────────────────────────────────── */}
            {(() => {
                const daily   = getBudgetMeta(stats.budget.daily_used,   stats.budget.daily_limit);
                const monthly = getBudgetMeta(stats.budget.monthly_used, stats.budget.monthly_limit);
                const isOverall = daily.pct >= 100 || monthly.pct >= 100;
                const isWarning = !isOverall && (daily.pct >= 75 || monthly.pct >= 75);

                // ── Happy Score tree state ────────────────────────────
                const treeEmoji    = isOverall ? '🥀' : isWarning ? '🌿' : '🌳';
                const treeMood     = isOverall ? 'Critical' : isWarning ? 'Warning' : 'Healthy';
                const treeBg       = isOverall ? 'from-red-50 to-rose-100 dark:from-red-900/20 dark:to-rose-900/20'
                                   : isWarning ? 'from-amber-50 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/20'
                                   :             'from-emerald-50 to-teal-100 dark:from-emerald-900/20 dark:to-teal-900/20';
                const treeMoodColor = isOverall ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-emerald-500';
                const treeAnim     = isOverall ? 'animate-pulse' : 'animate-none';

                return (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Daily Budget */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-gray-800 dark:text-white">Daily Budget</h3>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${daily.badge}`}>{daily.status}</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-5 overflow-hidden relative">
                                    <div
                                        className={`h-5 rounded-full transition-all duration-700 ${daily.barColor}`}
                                        style={{ width: `${Math.min(daily.pct, 100)}%` }}
                                    />
                                    {daily.pct > 20 && (
                                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow">
                                            {daily.pct.toFixed(0)}%
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-between mt-2">
                                    <p className={`text-xs font-semibold ${daily.label}`}>{daily.remaining}</p>
                                    <p className="text-xs text-gray-400">{stats.budget.daily_used} / {stats.budget.daily_limit} kg</p>
                                </div>
                            </div>

                            {/* Monthly Budget */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-gray-800 dark:text-white">Monthly Budget</h3>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${monthly.badge}`}>{monthly.status}</span>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-5 overflow-hidden relative">
                                    <div
                                        className={`h-5 rounded-full transition-all duration-700 ${monthly.barColor}`}
                                        style={{ width: `${Math.min(monthly.pct, 100)}%` }}
                                    />
                                    {monthly.pct > 20 && (
                                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white drop-shadow">
                                            {monthly.pct.toFixed(0)}%
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-between mt-2">
                                    <p className={`text-xs font-semibold ${monthly.label}`}>{monthly.remaining}</p>
                                    <p className="text-xs text-gray-400">{stats.budget.monthly_used} / {stats.budget.monthly_limit} kg</p>
                                </div>
                            </div>
                        </div>

                        {/* ── Eco Health & XP Row ─────────────────────────── */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* Happy Score Tree */}
                            <div className={`md:col-span-1 bg-gradient-to-br ${treeBg} rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center justify-center gap-2`}>
                                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">Eco Health Score</p>
                                <div className={`text-7xl select-none leading-none ${treeAnim}`} style={{
                                    filter: isOverall ? 'grayscale(70%)' : 'none',
                                    animation: isOverall ? undefined : 'treeSway 3s ease-in-out infinite',
                                }}>
                                    {treeEmoji}
                                </div>
                                <p className={`text-lg font-extrabold ${treeMoodColor}`}>{treeMood}</p>
                                <p className="text-[11px] text-center text-gray-500 dark:text-gray-400 max-w-[160px]">
                                    {isOverall ? 'Budget exceeded — take action to restore your eco balance.'
                                    : isWarning ? 'Approaching your limit — slow down emissions.'
                                    :             'Great job! Your carbon footprint is within safe limits.'}
                                </p>
                            </div>

                            {/* XP Card */}
                            <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-200">⚡ XP Points</p>
                                    <div className="text-right">
                                        <span className="text-2xl font-extrabold text-violet-600 dark:text-violet-400">{xp}</span>
                                        {gamificationStats && (
                                            <span className="ml-1 text-xs font-bold text-violet-400">Lv.{gamificationStats.level}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden mt-2">
                                    <div
                                        className="h-3 rounded-full bg-violet-500 transition-all duration-700"
                                        style={{ width: `${Math.min((xp / ((gamificationStats?.level ?? 1) * 100)) * 100, 100)}%` }}
                                    />
                                </div>
                                <div className="flex justify-between mt-2">
                                    <p className="text-xs text-gray-400">{xp} / {(gamificationStats?.level ?? 1) * 100} XP to next level</p>
                                    {gamificationStats && (
                                        <p className="text-xs text-orange-500 font-semibold">🔥 {gamificationStats.current_streak}d streak</p>
                                    )}
                                </div>
                                {daily.pct >= 100 || monthly.pct >= 100 ? (
                                    <div className="mt-3 text-xs text-red-500 font-semibold bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                                        ⚠️ Budget exceeded — XP penalty applied
                                    </div>
                                ) : null}
                            </div>

                            {/* EcoCoins Card */}
                            <div className="md:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-between">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-200">🍃 EcoCoins</p>
                                    <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{ecoCoins}</span>
                                </div>
                                {gamificationStats && (
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs text-gray-500">Sustainability Score:</span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                            gamificationStats.sustainability_score >= 75 ? 'bg-emerald-100 text-emerald-700'
                                            : gamificationStats.sustainability_score >= 40 ? 'bg-amber-100 text-amber-700'
                                            : 'bg-red-100 text-red-700'
                                        }`}>{gamificationStats.sustainability_score ?? 0}</span>
                                    </div>
                                )}
                                <div className="flex flex-wrap gap-1">
                                    {Array.from({ length: Math.min(ecoCoins, 20) }).map((_, i) => (
                                        <span key={i} className="text-lg leading-none">🪙</span>
                                    ))}
                                    {ecoCoins > 20 && <span className="text-xs text-gray-400 self-center">+{ecoCoins - 20} more</span>}
                                    {ecoCoins === 0 && <span className="text-xs text-red-500 font-semibold">No coins left — stay within budget!</span>}
                                </div>
                                <p className="text-xs text-gray-400 mt-3">Earn coins by staying within budget. Spend them in the reward shop.</p>
                            </div>
                        </div>
                    </>
                );
            })()}

            {/* Inline styles for tree sway animation (no extra library needed) */}
            <style>{`
                @keyframes treeSway {
                    0%, 100% { transform: rotate(-3deg); }
                    50%       { transform: rotate(3deg); }
                }
            `}</style>

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
                        <button
                            onClick={() => handleSubmit('travel')}
                            disabled={loading}
                            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-plus-circle"></i>}
                            Log Travel
                        </button>
                    </div>
                )}

                {/* Energy Form */}
                {activeTab === 'energy' && (
                    <div className="space-y-6 animate-fadeIn">
                        <h5 className="font-bold text-gray-800 dark:text-white mb-3">Smart Plug Integration</h5>

                        {/* Disconnected State */}
                        {connectionStatus === 'disconnected' && (
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


                        {/* Searching & Connecting States */}
                        {(connectionStatus === 'searching' || connectionStatus === 'connecting') && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800/30 rounded-xl p-6 flex items-start gap-4">
                                <div className="p-3 bg-yellow-100 dark:bg-yellow-800/40 rounded-full text-yellow-600 dark:text-yellow-400">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-yellow-800 dark:text-yellow-300">
                                        {connectionStatus === 'searching' ? 'Searching for devices...' : 'Connecting to Smart Plug...'}
                                    </h3>
                                    <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                                        {connectionStatus === 'searching' ? 'Scanning nearby networks...' : 'Establishing secure handshake...'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Live State - High Fidelity Dashboard */}
                        {connectionStatus === 'live' && (
                            <div className="bg-white dark:bg-gray-900 border border-teal-100 dark:border-teal-900/50 rounded-2xl p-6 shadow-lg">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-teal-100 dark:bg-teal-900/40 rounded-full text-teal-600 dark:text-teal-400 animate-pulse">
                                            <i className="fas fa-satellite-dish text-xl"></i>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl text-gray-800 dark:text-white">Live Energy Monitor</h3>
                                            <p className="text-sm text-teal-600 dark:text-teal-400 font-medium">
                                                <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse mr-2"></span>
                                                Live Telemetry: {currentTime ? currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Syncing...'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-gray-400 uppercase tracking-wider font-bold">System Status</div>
                                        {activeDevices.bulb || activeDevices.iron || Object.values(customDevices).some(d => d.active) ? (
                                            <div className="text-teal-500 font-bold flex items-center justify-end gap-1">
                                                <i className="fas fa-check-circle"></i>
                                                Online
                                            </div>
                                        ) : (
                                            <div className="text-red-500 font-bold flex items-center justify-end gap-1">
                                                <i className="fas fa-times-circle"></i>
                                                Offline
                                            </div>
                                        )}
                                        <div className="text-xs text-gray-400">Live IoT Syncing</div>
                                    </div>
                                </div>

                                {loadingForecast || !energyForecast ? (
                                    <div className="h-64 flex items-center justify-center text-gray-400 flex-col gap-2">
                                        <i className="fas fa-circle-notch fa-spin text-3xl text-teal-500"></i>
                                        <p>Syncing Digital Twin...</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Chart Data Processing */}
                                        {(() => {
                                            const history = energyForecast.history || [];
                                            const forecast = energyForecast.forecast || [];
                                            const live = liveDataPoints || [];

                                            // Helper to create a unified data point
                                            const createPoint = (item, type) => ({
                                                ...item,
                                                display_time: item.display_time || item.time, // Fallback
                                                power_history: type === 'history' ? item.power : null,
                                                power_forecast: type === 'forecast' ? item.power : null,
                                                power_live: type === 'live' ? item.power : null,
                                                full_time: item.time
                                            });

                                            // Process Data
                                            let processedData = [];

                                            // 1. History
                                            history.forEach(item => processedData.push(createPoint(item, 'history')));

                                            // 2. Forecast (Visual Bridge: Start Green line at the end of Blue line)
                                            if (processedData.length > 0 && forecast.length > 0) {
                                                // Enable 'power_forecast' on the last history point to start the green trend there
                                                const lastHistIndex = processedData.length - 1;
                                                processedData[lastHistIndex].power_forecast = processedData[lastHistIndex].power_history;
                                            }
                                            forecast.forEach(item => processedData.push(createPoint(item, 'forecast')));

                                            // 3. Live (Visual Bridge: Start Yellow line at the end of Green line)
                                            if (processedData.length > 0 && live.length > 0) {
                                                // Enable 'power_live' on the last point (which is end of forecast)
                                                const lastIndex = processedData.length - 1;
                                                // Use whatever value was active there (likely forecast)
                                                const val = processedData[lastIndex].power_forecast || processedData[lastIndex].power_history;
                                                processedData[lastIndex].power_live = val;
                                            }
                                            live.forEach(item => processedData.push(createPoint(item, 'live')));

                                            // Custom Tooltip
                                            const CustomTooltip = ({ active, payload, label }) => {
                                                if (active && payload && payload.length) {
                                                    // Find the active payload (non-null)
                                                    const data = payload.find(p => p.value !== null && p.value !== undefined);
                                                    if (!data) return null;

                                                    let labelText = '';
                                                    let color = '';
                                                    if (data.dataKey === 'power_history') { labelText = 'History'; color = '#3b82f6'; }
                                                    else if (data.dataKey === 'power_forecast') { labelText = 'AI Forecast'; color = '#10b981'; }
                                                    else if (data.dataKey === 'power_live') { labelText = 'Live Telemetry'; color = '#f59e0b'; }

                                                    return (
                                                        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg">
                                                            <p className="font-bold text-gray-700 dark:text-gray-200 mb-1">{label}</p>
                                                            <p className="text-sm font-medium" style={{ color: color }}>
                                                                {labelText}: <span className="text-base font-bold">{data.value} W</span>
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            };

                                            return (
                                                <div className="h-64 w-full mb-6">
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <ComposedChart
                                                            data={processedData}
                                                            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                                                        >
                                                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                                            <XAxis
                                                                dataKey="display_time"
                                                                stroke="#9ca3af"
                                                                tick={{ fontSize: 10 }}
                                                                interval="preserveStartEnd"
                                                                minTickGap={30}
                                                            />
                                                            <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} />
                                                            <Tooltip content={<CustomTooltip />} />

                                                            {/* Reference Line for "Now" / Sync Start */}
                                                            {forecast.length > 0 && (
                                                                <ReferenceLine
                                                                    x={forecast[forecast.length - 1].display_time}
                                                                    stroke="#f59e0b"
                                                                    strokeDasharray="3 3"
                                                                    label={{ value: 'Live Sync', position: 'top', fill: '#f59e0b', fontSize: 10, dy: -10 }}
                                                                />
                                                            )}

                                                            {/* Layer 1: History (Solid Blue) */}
                                                            <Line
                                                                type="monotone"
                                                                dataKey="power_history"
                                                                stroke="#3b82f6"
                                                                strokeWidth={2}
                                                                dot={false}
                                                                activeDot={{ r: 6 }}
                                                                connectNulls={true} // Connect to next segment if needed
                                                                animationDuration={1000}
                                                            />

                                                            {/* Layer 2: Forecast (Dashed Green) */}
                                                            <Line
                                                                type="monotone"
                                                                dataKey="power_forecast"
                                                                stroke="#10b981"
                                                                strokeWidth={2}
                                                                strokeDasharray="4 4"
                                                                dot={false}
                                                                activeDot={{ r: 6 }}
                                                                connectNulls={true} // Ensure it picks up from history if we overlap a point
                                                                animationDuration={1000}
                                                            />

                                                            {/* Layer 3: Live (Solid Yellow) */}
                                                            <Line
                                                                type="monotone"
                                                                dataKey="power_live"
                                                                stroke="#f59e0b"
                                                                strokeWidth={3}
                                                                dot={{ r: 3, strokeWidth: 0, fill: '#f59e0b' }}
                                                                activeDot={{ r: 6 }}
                                                                animationDuration={300}
                                                                isAnimationActive={false}
                                                            />

                                                            {/* Zoom/Brush Control */}
                                                            <Brush
                                                                dataKey="display_time"
                                                                height={30}
                                                                stroke="#14b8a6" // teal-500
                                                                travellerWidth={10}
                                                            />
                                                        </ComposedChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            );
                                        })()}

                                        {/* Device Status Table */}
                                        <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                                            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                                                <thead className="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase font-bold text-gray-500 dark:text-gray-400">
                                                    <tr>
                                                        <th className="px-6 py-3">Device Name</th>
                                                        <th className="px-6 py-3">Rated Power</th>
                                                        <th className="px-6 py-3">Real-time</th>
                                                        <th className="px-6 py-3">Status</th>
                                                        <th className="px-6 py-3 text-right">Last Sync</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                                    {/* Bulb Row */}
                                                    <tr className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${activeDevices.bulb ? '' : 'opacity-75'}`}>
                                                        <td className="px-6 py-4 font-bold text-gray-800 dark:text-white">
                                                            <div className="flex items-center gap-2">
                                                                <i className={`fas fa-lightbulb ${activeDevices.bulb ? 'text-yellow-400 drop-shadow-md' : 'text-gray-400'}`}></i> Smart LED Bulb
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">9 W</td>
                                                        <td className="px-6 py-4 font-mono font-bold text-yellow-600 dark:text-yellow-400">
                                                            {activeDevices.bulb ? (liveDataPoints.length > 0 ? liveDataPoints[liveDataPoints.length - 1].power + ' W' : '0.00 W') : '0.00 W'}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {activeDevices.bulb ? (
                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span> Active
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Inactive
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-right italic text-xs text-gray-400">
                                                            {currentTime ? currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '-'}
                                                        </td>
                                                    </tr>

                                                    {/* Electric Iron Row */}
                                                    <tr className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${activeDevices.iron ? '' : 'opacity-75'}`}>
                                                        <td className="px-6 py-4 font-bold text-gray-800 dark:text-white">
                                                            <div className="flex items-center gap-2">
                                                                <i className={`fas fa-tshirt ${activeDevices.iron ? 'text-orange-500 drop-shadow-md' : 'text-gray-400'}`}></i> Electric Iron
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">900 W</td>
                                                        <td className="px-6 py-4 font-mono font-bold text-orange-600 dark:text-orange-400">
                                                            {activeDevices.iron ? (liveDataPoints.length > 0 ? liveDataPoints[liveDataPoints.length - 1].power + ' W' : '0.00 W') : '0.00 W'}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {activeDevices.iron ? (
                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span> Active
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Inactive
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-right italic text-xs text-gray-400">
                                                            {currentTime ? currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '-'}
                                                        </td>
                                                    </tr>

                                                    {/* Custom Devices */}
                                                    {customDevices.map((device, index) => (
                                                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors opacity-75">
                                                            <td className="px-6 py-4 font-bold text-gray-800 dark:text-white">
                                                                <div className="flex items-center gap-2">
                                                                    <i className="fas fa-plug text-gray-400"></i> {device.name}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">{device.power} W</td>
                                                            <td className="px-6 py-4 font-mono font-bold text-gray-600 dark:text-gray-400">
                                                                0 W
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> Inactive
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-right italic text-xs">Manual Add</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>

                                            {/* Add Device Button & Form */}
                                            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                                {!showAddDevice ? (
                                                    <button
                                                        onClick={() => setShowAddDevice(true)}
                                                        className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 text-sm font-medium rounded transition-colors flex items-center gap-2"
                                                    >
                                                        <i className="fas fa-plus"></i> Add Device
                                                    </button>
                                                ) : (
                                                    <div className="flex flex-wrap items-end gap-3">
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-500 mb-1">Device Name</label>
                                                            <input
                                                                type="text"
                                                                value={newDevice.name}
                                                                onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                                                                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-teal-500 outline-none text-sm"
                                                                placeholder="e.g. Microwave"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-500 mb-1">Rated Power (W)</label>
                                                            <input
                                                                type="number"
                                                                value={newDevice.power}
                                                                onChange={(e) => setNewDevice({ ...newDevice, power: e.target.value })}
                                                                className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-teal-500 outline-none text-sm w-32"
                                                                placeholder="e.g. 1200"
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                if (newDevice.name && newDevice.power) {
                                                                    setCustomDevices([...customDevices, newDevice]);
                                                                    setNewDevice({ name: '', power: '' });
                                                                    setShowAddDevice(false);
                                                                }
                                                            }}
                                                            className="px-4 py-1.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 h-[34px]"
                                                        >
                                                            Update List
                                                        </button>
                                                        <button
                                                            onClick={() => setShowAddDevice(false)}
                                                            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors h-[34px]"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                                <div className="text-gray-500 text-xs font-bold uppercase mb-1">Total Energy Consumed</div>
                                                <div className="text-2xl font-bold text-gray-800 dark:text-white">
                                                    {liveStats.energy.toFixed(4)} <span className="text-sm font-normal text-gray-500">Wh</span>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                                <div className="text-gray-500 text-xs font-bold uppercase mb-1">Live Carbon Emissions</div>
                                                <div className="text-2xl font-bold text-teal-600">
                                                    {liveStats.emissions.toFixed(6)} <span className="text-sm font-normal text-gray-500">kg CO₂</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={fetchEnergyForecast}
                                                className="flex-1 px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                                            >
                                                <i className="fas fa-sync-alt"></i>
                                                Refresh Link
                                            </button>
                                            <button
                                                onClick={() => handlePlugAction('disconnect')}
                                                className="flex-1 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                                            >
                                                <i className="fas fa-power-off"></i>
                                                Disconnect
                                            </button>
                                        </div>
                                    </>
                                )}
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
                                <button
                                    onClick={() => handleSubmit('energy')}
                                    disabled={loading}
                                    className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-plus-circle"></i>}
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
                        <button
                            onClick={() => handleSubmit('food')}
                            disabled={loading}
                            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-plus-circle"></i>}
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
                        <button
                            onClick={() => handleSubmit('consumption')} // Note: 'purchase' maps to 'consumption' in backend
                            disabled={loading}
                            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-plus-circle"></i>}
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
                        <button
                            onClick={() => handleSubmit('waste')}
                            disabled={loading}
                            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-plus-circle"></i>}
                            Log Waste
                        </button>
                    </div>
                )}

            </div>

            {/* Activity History */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 transition-colors">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Activity History</h2>
                    <button onClick={fetchActivities} className="text-teal-500 hover:text-teal-600">
                        <i className={`fas fa-sync-alt ${loadingHistory ? 'fa-spin' : ''}`}></i>
                    </button>
                </div>

                {/* Filters */}
                <div className="flex gap-4 mb-6">
                    <div className="relative flex-1">
                        <input
                            type="date"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-teal-500 outline-none"
                            value={filters.date}
                            onChange={(e) => handleFilterChange('date', e.target.value)}
                        />
                    </div>
                    <div className="relative flex-1">
                        <select
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-teal-500 outline-none"
                            value={filters.category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                        >
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
                    {loadingHistory ? (
                        <div className="text-center py-8 text-gray-500">Loading history...</div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">No activities found.</div>
                    ) : (
                        history.map((item) => {
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
                                    <div className="col-span-2 text-gray-500 dark:text-gray-400 text-sm">{new Date(item.timestamp).toLocaleDateString()}</div>
                                    <div className={`col-span-1 text-right font-bold ${item.carbon_footprint_kg < 0 ? 'text-green-500' : 'text-gray-800 dark:text-white'}`}>
                                        {item.carbon_footprint_kg > 0 ? '+' : ''}{item.carbon_footprint_kg.toFixed(2)}
                                    </div>
                                    <div className="col-span-1 text-center">
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default LogActivity;
