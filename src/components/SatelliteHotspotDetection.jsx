import { useState, useEffect, useRef } from 'react';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';

// ── Lightweight Leaflet map loaded dynamically (no npm install needed) ───────
const LeafletMap = ({ points, hotspots }) => {
    const mapRef = useRef(null);
    const leafletInstance = useRef(null);

    useEffect(() => {
        if (!mapRef.current || leafletInstance.current) return;

        // Dynamically inject Leaflet CSS + JS
        const linkEl = document.createElement('link');
        linkEl.rel  = 'stylesheet';
        linkEl.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(linkEl);

        const scriptEl = document.createElement('script');
        scriptEl.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        scriptEl.onload = () => {
            const L = window.L;
            const map = L.map(mapRef.current, {
                center: [22.5, 78.9],
                zoom: 5,
                zoomControl: true,
            });
            leafletInstance.current = map;

            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '© OpenStreetMap © CARTO',
                maxZoom: 18,
            }).addTo(map);

            // Normal monitoring points (blue)
            points.filter(p => !p.is_hotspot).forEach(p => {
                L.circleMarker([p.latitude, p.longitude], {
                    radius: 6,
                    color: '#14b8a6',
                    fillColor: '#14b8a6',
                    fillOpacity: 0.5,
                    weight: 1,
                }).addTo(map)
                .bindPopup(`
                    <div style="font-family:sans-serif;min-width:160px">
                        <strong style="color:#14b8a6">📡 ${p.city}</strong><br/>
                        NO₂: <b>${p.no2_ppb} ppb</b><br/>
                        <span style="color:#6b7280;font-size:11px">Normal Level</span>
                    </div>
                `);
            });

            // Hotspot points (red pulsing)
            hotspots.forEach(p => {
                const icon = L.divIcon({
                    className: '',
                    html: `<div style="
                        width:20px;height:20px;border-radius:50%;
                        background:rgba(239,68,68,0.75);
                        border:2px solid #ef4444;
                        box-shadow:0 0 0 6px rgba(239,68,68,0.2);
                        animation:none;
                    "></div>`,
                    iconSize: [20, 20],
                    iconAnchor: [10, 10],
                });
                L.marker([p.latitude, p.longitude], { icon }).addTo(map)
                .bindPopup(`
                    <div style="font-family:sans-serif;min-width:170px">
                        <strong style="color:#ef4444">🔴 HOTSPOT – ${p.city}</strong><br/>
                        NO₂: <b>${p.no2_ppb} ppb</b><br/>
                        Anomaly Score: ${p.anomaly_score}<br/>
                        <span style="color:#ef4444;font-size:11px;font-weight:bold">⚠️ Elevated Emission Detected</span>
                    </div>
                `);
            });
        };
        document.head.appendChild(scriptEl);

        return () => {
            if (leafletInstance.current) {
                leafletInstance.current.remove();
                leafletInstance.current = null;
            }
        };
    }, [points, hotspots]);

    return <div ref={mapRef} style={{ height: '420px', width: '100%', borderRadius: '12px', zIndex: 0 }} />;
};

// ── Tooltip for prediction chart ──────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: '#1f2937', borderRadius: 8, padding: '8px 14px', color: '#fff', fontSize: 13 }}>
            <p style={{ margin: 0, fontWeight: 700 }}>Year {label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ margin: '2px 0', color: p.color }}>
                    {p.name}: {p.value} Gt CO₂
                </p>
            ))}
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
const SatelliteHotspotDetection = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('map'); // 'map' | 'prediction'

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/satellite-hotspots/`);
                if (!res.ok) throw new Error(`API error: ${res.status}`);
                const json = await res.json();
                setData(json);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const chartData = data?.trend_data?.map(d => ({
        year: d.year,
        historical: d.type === 'historical' ? d.co2 : null,
        forecast:   d.type === 'forecast'   ? d.co2 : null,
        // Bridge  the gap at the last historical point
    })) ?? [];

    // Bridge: last historical point should also appear as first forecast
    if (data?.trend_data) {
        const lastHist = [...data.trend_data].filter(d => d.type === 'historical').pop();
        const bridgeIdx = chartData.findIndex(d => d.year === lastHist?.year);
        if (bridgeIdx >= 0 && chartData[bridgeIdx + 1]) {
            chartData[bridgeIdx].forecast = chartData[bridgeIdx].historical;
        }
    }

    return (
        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                        <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        Live Satellite Analysis
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
                        📡 Satellite Emission Hotspot Detection
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-3xl mx-auto text-sm leading-relaxed">
                        Using <strong>Sentinel-5P satellite NO₂ measurements</strong> and an <strong>Isolation Forest ML model</strong>,
                        our system automatically detects abnormal emission hotspots in real time.
                        Red markers indicate detected emission sources; blue markers are normal monitoring stations.
                    </p>
                </div>

                {/* Stats Row */}
                {data && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {[
                            { label: 'Monitoring Points', value: data.total_points, icon: '📡', color: 'text-teal-600 dark:text-teal-400' },
                            { label: 'Hotspots Detected', value: data.hotspot_count, icon: '🔴', color: 'text-red-500' },
                            { label: 'Avg NO₂ Level', value: `${data.avg_no2_ppb} ppb`, icon: '🌫️', color: 'text-amber-500' },
                            { label: 'ML Model', value: 'Isolation Forest', icon: '🤖', color: 'text-violet-600 dark:text-violet-400' },
                        ].map((s, i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                                <div className="text-2xl mb-1">{s.icon}</div>
                                <p className={`text-lg font-extrabold ${s.color}`}>{s.value}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{s.label}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Tabs */}
                <div className="flex gap-2 mb-4">
                    {[['map', '🗺️ Hotspot Map'], ['prediction', '📈 5-Year CO₂ Forecast']].map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                activeTab === key
                                    ? 'bg-teal-600 text-white shadow-md'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-teal-400'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                    {loading && (
                        <div className="h-[420px] flex flex-col items-center justify-center gap-4 animate-pulse">
                            <div className="w-16 h-16 rounded-full border-4 border-teal-500 border-t-transparent animate-spin" />
                            <p className="text-gray-500 dark:text-gray-400 font-medium">
                                Running ML anomaly detection…
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="h-[420px] flex items-center justify-center">
                            <p className="text-red-500 font-semibold">⚠️ {error}</p>
                        </div>
                    )}

                    {!loading && !error && data && (
                        <>
                            {/* ── Map Tab ── */}
                            {activeTab === 'map' && (
                                <>
                                    <div className="flex items-center gap-6 text-sm mb-4">
                                        <span className="flex items-center gap-2">
                                            <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                                            <span className="text-gray-500 dark:text-gray-400">Emission Hotspot ({data.hotspot_count})</span>
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <span className="inline-block w-3 h-3 rounded-full bg-teal-500"></span>
                                            <span className="text-gray-500 dark:text-gray-400">Normal Level ({data.total_points - data.hotspot_count})</span>
                                        </span>
                                    </div>
                                    <LeafletMap points={data.all_points} hotspots={data.hotspots} />

                                    {/* Hotspot list */}
                                    <div className="mt-6">
                                        <h4 className="font-bold text-gray-800 dark:text-white text-sm mb-3">🔴 Detected Emission Hotspots</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                            {data.hotspots.map((h, i) => (
                                                <div key={i} className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl px-4 py-3">
                                                    <span className="text-red-500 text-lg">🔴</span>
                                                    <div>
                                                        <p className="font-bold text-gray-800 dark:text-white text-sm">{h.city}</p>
                                                        <p className="text-xs text-red-500 font-semibold">{h.no2_ppb} ppb NO₂</p>
                                                        <p className="text-[10px] text-gray-400">Score: {h.anomaly_score}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* ── Prediction Tab ── */}
                            {activeTab === 'prediction' && (
                                <>
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h4 className="font-bold text-gray-800 dark:text-white">Global CO₂ Forecast (2025–2030)</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">Linear regression on historical Gt CO₂ data · Dashed = AI prediction</p>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <span className="inline-block w-5 h-[3px] bg-teal-500 rounded"></span> Historical
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="inline-block w-5 h-[2px] border-b-2 border-dashed border-yellow-400"></span> Forecast
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-96">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <ComposedChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
                                                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                                <YAxis
                                                    axisLine={false} tickLine={false}
                                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                                    domain={['auto', 'auto']}
                                                    tickFormatter={v => `${v} Gt`}
                                                />
                                                <Tooltip content={<CustomTooltip />} />
                                                <ReferenceLine x={2024} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.7}
                                                    label={{ value: 'Forecast →', position: 'top', fill: '#f59e0b', fontSize: 11 }} />
                                                <Line type="monotone" dataKey="historical" name="Historical"
                                                    stroke="#14b8a6" strokeWidth={2.5}
                                                    dot={{ r: 4, fill: '#14b8a6', stroke: '#fff', strokeWidth: 2 }}
                                                    activeDot={{ r: 6 }} connectNulls={false} />
                                                <Line type="monotone" dataKey="forecast" name="AI Forecast"
                                                    stroke="#f59e0b" strokeWidth={2.5} strokeDasharray="6 4"
                                                    dot={{ r: 4, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }}
                                                    activeDot={{ r: 6 }} connectNulls={false} />
                                            </ComposedChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <p className="text-xs text-center text-gray-400 mt-3">
                                        Source: Global Carbon Budget 2024 · Forecast: simple linear regression on 2019–2024 data
                                    </p>
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default SatelliteHotspotDetection;
