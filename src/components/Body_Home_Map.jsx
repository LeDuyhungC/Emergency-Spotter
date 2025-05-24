import { GoogleMap, useLoadScript, Marker, DirectionsRenderer, Circle } from "@react-google-maps/api";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import "../css/Body_Home_Map.css";
//npm install @react-google-maps/api , react google api package
const libraries = ["places"];
export default function Body_Home_Map( {address}) {
    const {isLoaded} = useLoadScript({
        googleMapsApiKey:import.meta.env.VITE_API_KEY_GOOGLE_MAP,
        libraries
    
    });

    const [center, setCenter] = useState(null);

    useEffect(() => {
        if (!isLoaded) return
        const geocodeAddress = async (address) => {
            const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ address: address }, (results, status) => {
                if (status === 'OK' && results.length > 0) {
                    const location = results[0].geometry.location;
                    setCenter({ lat: location.lat(), lng: location.lng() });
                } else {
                    console.error('Geocoding failed:', status);
                }
            });
        };

        if (address) geocodeAddress(address);
    }, [address, isLoaded]);
    
    
    if (!isLoaded) return <div>Loading...</div>
    return (
        <>
            <h2>Map</h2>

            <div className="map-container">
                <div className="controls"></div>
                <GoogleMap zoom={10} center={center} mapContainerClassName="map"></GoogleMap>
            </div>
        </>
    )
}