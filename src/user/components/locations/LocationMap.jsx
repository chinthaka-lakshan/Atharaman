import React, { useState, useCallback } from "react";
import {
  MapContainer, TileLayer, Marker, Popup,
  ScaleControl, ZoomControl, LayersControl, useMapEvents, useMap
} from "react-leaflet";
import L from "leaflet";
import { motion, AnimatePresence } from "framer-motion";
import {
  Navigation, MapPin, ExternalLink, Layers, Maximize2,
  Minimize2, Copy, Share2, Crosshair, X, Check
} from "lucide-react";

const { BaseLayer } = LayersControl;

// ── Tile layers ────────────────────────────────────────────
const LAYERS = [
  {
    name: "Street",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution: "© OpenStreetMap © CARTO",
  },
  {
    name: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles © Esri",
  },
  {
    name: "Terrain",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: "© OpenStreetMap © OpenTopoMap",
  },
  {
    name: "Dark",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "© OpenStreetMap © CARTO",
  },
];

// ── Custom marker icon ─────────────────────────────────────
const pinIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -42],
});

// ── Sub-components ─────────────────────────────────────────

/** Tracks mouse lat/lng and click events */
function MapEventTracker({ onMove, onClick }) {
  useMapEvents({
    mousemove(e) { onMove(e.latlng); },
    click(e)     { onClick(e.latlng); },
  });
  return null;
}

/** Programmatically fly to a position */
function FlyTo({ target }) {
  const map = useMap();
  if (target) map.flyTo([target.lat, target.lng], 15, { duration: 1.4 });
  return null;
}

// ── Main Component ─────────────────────────────────────────
const LocationMap = ({ latitude, longitude, name }) => {
  const [activeLayer, setActiveLayer]   = useState(0);
  const [fullscreen, setFullscreen]     = useState(false);
  const [cursorPos, setCursorPos]       = useState(null);
  const [clickedPin, setClickedPin]     = useState(null);
  const [copied, setCopied]             = useState(false);
  const [flyTarget, setFlyTarget]       = useState(null);

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);

  const handleCopyCoords = async () => {
    const text = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  };

  const handleDirections = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
  };

  const handleRecenter = () => {
    setFlyTarget({ lat, lng });
    setTimeout(() => setFlyTarget(null), 100);
  };

  const handleMapMove  = useCallback((latlng) => setCursorPos(latlng), []);
  const handleMapClick = useCallback((latlng) => setClickedPin(latlng), []);

  if (!latitude || !longitude) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
        <MapPin size={36} className="mb-2 opacity-30" />
        <p className="text-sm font-medium">No coordinates available</p>
      </div>
    );
  }

  const mapHeight = fullscreen ? "100%" : 480;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >

      {/* ── Fullscreen Overlay ── */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MapContainer
              center={[lat, lng]} zoom={14}
              style={{ height: "100vh", width: "100%" }}
              zoomControl={false} attributionControl={false}
            >
              <TileLayer url={LAYERS[activeLayer].url} attribution={LAYERS[activeLayer].attribution} />
              <Marker position={[lat, lng]} icon={pinIcon}>
                <Popup closeButton={false}>
                  <div style={{ textAlign: "center", minWidth: 140, fontFamily: "inherit" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>📍 {name}</div>
                    <button onClick={handleDirections} style={{ background: "linear-gradient(135deg,#3b82f6,#6366f1)", color: "#fff", border: "none", borderRadius: 8, padding: "5px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                      Get Directions
                    </button>
                  </div>
                </Popup>
              </Marker>
              <ZoomControl position="bottomright" />
              <ScaleControl position="bottomleft" />
              <MapEventTracker onMove={handleMapMove} onClick={handleMapClick} />
              <FlyTo target={flyTarget} />
              {clickedPin && (
                <Marker position={[clickedPin.lat, clickedPin.lng]} icon={new L.DivIcon({ className: '', html: '<div style="width:14px;height:14px;border-radius:50%;background:#ef4444;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)"></div>', iconAnchor: [7,7] })}>
                  <Popup>Clicked: {clickedPin.lat.toFixed(5)}, {clickedPin.lng.toFixed(5)}</Popup>
                </Marker>
              )}
            </MapContainer>
            {/* Close fullscreen */}
            <button onClick={() => setFullscreen(false)}
              style={{ position: "fixed", top: 16, right: 16, zIndex: 10000, background: "white", border: "none", borderRadius: 12, padding: "10px 14px", cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.25)", display: "flex", alignItems: "center", gap: 6, fontWeight: 600, fontSize: 13 }}>
              <Minimize2 size={16} /> Exit Fullscreen
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        
        {/* ── Header bar ── */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100 bg-white">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex-shrink-0 flex items-center justify-center">
              <MapPin size={14} className="text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{name}</p>
              <p className="text-xs text-gray-400 truncate">{lat.toFixed(5)}°N, {lng.toFixed(5)}°E</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
            {/* Copy coords */}
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleCopyCoords}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200">
              {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
              {copied ? "Copied!" : "Copy"}
            </motion.button>
            {/* Share */}
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200">
              <Share2 size={13} /> Share
            </motion.button>
            {/* Fullscreen */}
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setFullscreen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-sm">
              <Maximize2 size={13} /> Fullscreen
            </motion.button>
          </div>
        </div>

        {/* ── Layer switcher ── */}
        <div className="px-4 py-2 flex items-center gap-2 border-b border-gray-50 bg-gray-50/50">
          <Layers size={13} className="text-gray-400 flex-shrink-0" />
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mr-1">Layer:</span>
          <div className="flex gap-1.5 flex-wrap">
            {LAYERS.map((l, i) => (
              <button key={i} onClick={() => setActiveLayer(i)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                  activeLayer === i
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-gray-500 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
                }`}>
                {l.name}
              </button>
            ))}
          </div>
        </div>

        {/* ── Map ── */}
        <div style={{ position: "relative" }}>
          <MapContainer
            center={[lat, lng]} zoom={14}
            style={{ height: mapHeight, width: "100%" }}
            zoomControl={false} attributionControl={false}
            key={activeLayer} // re-mount when layer changes
          >
            <TileLayer url={LAYERS[activeLayer].url} attribution={LAYERS[activeLayer].attribution} />
            <Marker position={[lat, lng]} icon={pinIcon}>
              <Popup closeButton={false} minWidth={160}>
                <div style={{ textAlign: "center", fontFamily: "inherit", padding: "4px 6px" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 4 }}>📍 {name}</div>
                  <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 8 }}>
                    {lat.toFixed(5)}°N, {lng.toFixed(5)}°E
                  </div>
                  <button onClick={handleDirections}
                    style={{ background: "linear-gradient(135deg,#3b82f6,#6366f1)", color: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer", width: "100%" }}>
                    🧭 Get Directions
                  </button>
                </div>
              </Popup>
            </Marker>

            {/* Clicked secondary pin */}
            {clickedPin && (
              <Marker position={[clickedPin.lat, clickedPin.lng]}
                icon={new L.DivIcon({ className: '', html: '<div style="width:14px;height:14px;border-radius:50%;background:#ef4444;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35)"></div>', iconAnchor: [7, 7] })}>
                <Popup closeButton={false}>
                  <div style={{ fontFamily: "inherit", fontSize: 12, padding: "2px 4px" }}>
                    <div style={{ fontWeight: 600, marginBottom: 2 }}>📌 Clicked Location</div>
                    <div style={{ color: "#6b7280", fontSize: 11 }}>{clickedPin.lat.toFixed(5)}°, {clickedPin.lng.toFixed(5)}°</div>
                  </div>
                </Popup>
              </Marker>
            )}

            <ZoomControl position="bottomright" />
            <ScaleControl position="bottomleft" metric imperial={false} />
            <MapEventTracker onMove={handleMapMove} onClick={handleMapClick} />
            <FlyTo target={flyTarget} />
          </MapContainer>

          {/* Cursor coordinates overlay */}
          {cursorPos && (
            <div className="pointer-events-none" style={{
              position: "absolute", bottom: 38, right: 12, zIndex: 1000,
              background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)",
              color: "white", borderRadius: 8, padding: "4px 10px",
              fontSize: 11, fontWeight: 500, fontFamily: "monospace",
            }}>
              {cursorPos.lat.toFixed(5)}° N &nbsp;|&nbsp; {cursorPos.lng.toFixed(5)}° E
            </div>
          )}

          {/* Recenter button */}
          <div style={{ position: "absolute", top: 12, right: 12, zIndex: 1000 }}>
            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
              onClick={handleRecenter}
              style={{ background: "white", border: "none", borderRadius: 10, padding: "8px 12px", cursor: "pointer", boxShadow: "0 2px 12px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "#374151" }}>
              <Crosshair size={14} className="text-blue-500" /> Recenter
            </motion.button>
          </div>

          {/* Clear click pin */}
          {clickedPin && (
            <div style={{ position: "absolute", top: 52, right: 12, zIndex: 1000 }}>
              <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
                onClick={() => setClickedPin(null)}
                style={{ background: "#fee2e2", border: "none", borderRadius: 10, padding: "6px 10px", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "#dc2626" }}>
                <X size={13} /> Clear Pin
              </motion.button>
            </div>
          )}
        </div>

        {/* ── Action buttons ── */}
        <div className="p-4 flex gap-3 border-t border-gray-100">
          <motion.button whileHover={{ scale: 1.03, boxShadow: "0 8px 24px rgba(99,102,241,0.4)" }}
            whileTap={{ scale: 0.97 }}
            onClick={handleDirections}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white"
            style={{ background: "linear-gradient(135deg,#3b82f6,#6366f1)", border: "none", cursor: "pointer" }}>
            <Navigation size={16} /> Get Directions
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={handleShare}
            className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-semibold text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            style={{ border: "none", cursor: "pointer" }}>
            <ExternalLink size={16} /> Open in Maps
          </motion.button>
        </div>

        {/* Attribution */}
        <div className="px-4 pb-3 text-[10px] text-gray-300 text-right">
          {LAYERS[activeLayer].attribution}
        </div>
      </div>
    </motion.div>
  );
};

export default LocationMap;