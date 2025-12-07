import { useCallback, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "320px",
};

const centerRiyadh = {
  lat: 24.7136,
  lng: 46.6753,
};

export default function MapSelector({ onLocationSelect, initialCoords }) {
  const [marker, setMarker] = useState(initialCoords || null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const handleClick = useCallback(
    (e) => {
      const coords = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };
      setMarker(coords);
      onLocationSelect?.(coords);
    },
    [onLocationSelect]
  );

  if (loadError) return <p className="text-red-500 text-sm">Map failed to load.</p>;
  if (!isLoaded) return <p className="text-slate-500 text-sm">Loading map...</p>;

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={marker || centerRiyadh}
        zoom={marker ? 14 : 11}
        onClick={handleClick}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>
      <div className="px-4 py-2 text-xs text-slate-500 bg-white border-t border-slate-100">
        Click on the map to select report location.
      </div>
    </div>
  );
}
