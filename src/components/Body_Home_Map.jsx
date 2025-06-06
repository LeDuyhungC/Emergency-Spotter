import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { useState, useMemo, useEffect } from "react";
import "../css/Body_Home_Map.css";
//npm install @react-google-maps/api , react google api package
const libraries = ["places"];
const presetCenter = { lat: 47.24537488661276, lng: -122.43856306605967}


export default function Body_Home_Map( { addresses }) {

    const [markers, setMarkers] = useState([]);
    const [center, setCenter] = useState(presetCenter);
    const [userLocation, setUserLocation] = useState(null);

    const options = useMemo(() => ({
        disableDefaultUi: true,
        clickableIcons: false,
        streetViewControl: false,
    }), []);


    const {isLoaded} = useLoadScript({
        googleMapsApiKey:import.meta.env.VITE_API_KEY_GOOGLE_MAP,
        libraries
    
    });

//=============================[GET CURRENT LOCATION]=============================================
  useEffect(() => {
    if (!isLoaded) return;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
        (position) => {
            const currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            setCenter(currentLocation);
            setUserLocation(currentLocation);
            console.log("User location found and set as center.");
        },
        (error) => {
            console.error("Error getting user location:", error.message);
            console.log("Falling back to preset location.");
            setCenter(presetCenter);
            setUserLocation(presetCenter)
        }
        );
    } else {
        setCenter(presetCenter);
        setUserLocation(presetCenter)
        console.log("Geolocation is not supported by this browser.");
    }}, [isLoaded]);

    useEffect(() => {
        // Don't do anything unless map is loaded gets addresses
        if (!isLoaded || !addresses || addresses.length === 0) return;

        const geocoder = new window.google.maps.Geocoder();

        // Use Promise.all to wait for all geocoding requests to finish for all addresses
        Promise.all(
            addresses.map((addressObj) => {
            // promise for each geocoder conversion
                return new Promise((resolve, reject) => {
                    geocoder.geocode({ address: addressObj.Address }, (results, status) => {
                        if (status === "OK") {
                        // Resolve with the lat/lng and the original Report_ID for a stable key
                        resolve({
                            lat: results[0].geometry.location.lat(),
                            lng: results[0].geometry.location.lng(),
                            id: addressObj.Report_ID, // Use the ID from your query
                        });
                        } else {
                            // Reject if geocoding fails for an address
                            console.error(`Geocoding failed for address "${addressObj.Address}" with status: ${status}`);
                            resolve(null); // Resolve with null to not break the whole Promise.all
                        }
                    });
                });
            })
        )
        .then((geocodedMarkers) => {
            const validMarkers = geocodedMarkers.filter(marker => marker !== null);
            setMarkers(validMarkers);
        });
    }, [isLoaded, addresses]); // This effect runs when the map loads or when the addresses prop changes
    
    
    if (!isLoaded) return <div>Loading...</div>

    console.log("Addresses Prop:", addresses);
    console.log("Center State:", center);
    console.log("Markers State:", markers);

    return (
        <>
            <h2>Map</h2>

            <div className="map-container">
                <GoogleMap zoom={10} center={center} mapContainerClassName="map" options={options}>
                    {markers.map((marker) => (
                        <Marker
                            key={marker.id}
                            position={{ lat: marker.lat, lng: marker.lng }}
                        />
                    ))}
                    {userLocation && (
                        <Marker
                            key="user-location"
                            position={userLocation}
                            // Add a custom icon to make it stand out (e.g., a blue dot)
                            icon={{
                            path: window.google.maps.SymbolPath.CIRCLE,
                            fillColor: '#ffff00',
                            fillOpacity: 1,
                            strokeColor: '#000000',
                            strokeWeight: 2,
                            scale: 8,
                            }}
                        />
                    )}
                </GoogleMap>
            </div>
        </>
    )
}