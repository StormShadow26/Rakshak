import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';

export default function HotspotMap() {
  const [hotspots, setHotspots] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/hotspots")
      .then(res => res.json())
      .then(data => {
        console.log("🔥 Hotspots from backend:", data);
        setHotspots(data);
      })
      .catch(err => console.error("Failed to fetch hotspot data:", err));
  }, []);

  const getColor = (title) => {
    const lower = title.toLowerCase();
    if (lower.includes("epidemic") || lower.includes("pandemic")) return "red";
    if (lower.includes("flood")) return "blue";
    if (lower.includes("earthquake")) return "orange";
    return "purple";
  };

  const getRadius = (severity) => {
    if (!severity || isNaN(severity)) return 80000;
    return 50000 + severity * 30000; // e.g., severity 1 → 80k, severity 5 → 200k
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-tr from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      {/* Header */}
      <header className="text-center py-6 shadow-md border-b border-white/20">
        <h1 className="text-4xl font-extrabold tracking-wide text-pink-300">🌍 Global Crisis Hotspot Map</h1>
        <p className="text-sm mt-2 text-purple-200">Track active natural and health disasters around the globe</p>
      </header>

      {/* Content: Map + Legend */}
      <div className="flex flex-1 flex-col md:flex-row p-6 gap-6">
        {/* Map Box */}
        <div className="w-full md:w-3/4 bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-300">
          <MapContainer
            center={[20, 0]}
            zoom={2}
            minZoom={2}
            maxZoom={6}
            scrollWheelZoom={true}
            style={{ height: "80vh", width: "100%" }}
            worldCopyJump={false}
            maxBounds={[
              [-90, -180],
              [90, 180]
            ]}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {hotspots.map((spot, idx) => (
              <Circle
                key={idx}
                center={[spot.lat, spot.lon]}
                radius={getRadius(spot.severity)}
                pathOptions={{ color: getColor(spot.title), fillOpacity: 0.5 }}
              >
                <Popup>
                  <strong>{spot.title}</strong><br />
                  {spot.location}<br />
                  {spot.date}<br />
                  Severity: {spot.severity || "N/A"}
                </Popup>
              </Circle>
            ))}
          </MapContainer>
        </div>

        {/* Legend Panel */}
        <div className="w-full md:w-1/4 bg-[#1f1f2e] rounded-3xl shadow-lg p-6 border border-white/10">
          <h2 className="text-2xl font-bold text-pink-200 mb-4">🧭 Legend</h2>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center">
              <span className="w-4 h-4 bg-red-500 rounded-full mr-2"></span> Epidemics / Pandemics
            </li>
            <li className="flex items-center">
              <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span> Floods
            </li>
            <li className="flex items-center">
              <span className="w-4 h-4 bg-orange-500 rounded-full mr-2"></span> Earthquakes
            </li>
            <li className="flex items-center">
              <span className="w-4 h-4 bg-purple-500 rounded-full mr-2"></span> Other Incidents
            </li>
          </ul>

          
        </div>
      </div>
    </div>
  );
}
