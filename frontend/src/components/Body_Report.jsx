import { useState, useEffect } from "react";
import "/frontend/css/Body_Report.css";

export default function Body_Report() {

// =====================================================GETTING THE CURRENT LOCATION====================================================================
    //Using the google map geocoding and navigator api
    const [coordinates, setCoordinates] = useState(null);
    const [address, setAddress] = useState(null);
    const [status, setStatus] = useState(null);
    const [location, setLocation] = useState('');
// If address state changes this effect will apply.
    useEffect(() => { 
    if (address) {
        setLocation(address);
    }
    }, [address]);
// Using the navigator api to get lng lat position
    useEffect(() => {
        const getCurrentPosition = () => {
            if (!navigator.geolocation) {
                setStatus("Geolocation is not supported by your browser");
                return;
            }
            setStatus("Loading...");
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setStatus(null);
                    setCoordinates({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    });
                    reverseGeocode(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    setStatus(`Location Error: ${error.message}`);
                }
            );
        };
        getCurrentPosition();
    }, []);
// Function to reverse geocode coordinates to address using the google map api
    const reverseGeocode = async (latitude, longitude) => {
        const apiKey = import.meta.env.VITE_API_KEY_GOOGLE_MAP;
        const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
        try {
            const response = await fetch(geocodingUrl);
            const data = await response.json();
            if (data.status === 'OK' && data.results.length > 0) setAddress(data.results[0].formatted_address);
            else setStatus("Error reverse geocoding: " + data.status);
        } catch (error) {
            setStatus("Error reverse geocoding: " + error.message);
        }
    };
//=======================================================================================================================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Extract form data
        const formData = {
            firstName: event.target[0].value,
            lastName: event.target[1].value,
            personnelType: event.target[2].value,
            emergency: event.target[3].value,
            location: event.target[4].value,
            date: event.target[5].value,
            time: event.target[6].value,
            services: event.target[7].value, // New field
            population: event.target[8].value, // New field
            hours: event.target[9].value // New field
        };

        try {
            console.log('Submitting form data:', formData); // Debug log
            const response = await fetch('http://localhost:5002/api/report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            console.log('Response JSON:', result); // Debug log
            if (response.ok) {
                alert('Report submitted successfully! JSON Response: ' + JSON.stringify(result));
                event.target.reset(); // Clear the form
            } else {
                alert('Error: ' + JSON.stringify(result));
            }
        } catch (err) {
            console.error('Fetch error:', err); // Debug log
            alert('Failed to submit report: ' + err.message);
        }
    };

    // Sample services options based on the screenshot
    const serviceOptions = [
        'Resident Housing',
        'Medical',
        'Shelter, Medical, Food',
        'Law Enforcement',
        'Fire Rescue',
        'Storm Shelter, Medical, Food',
        'Bunker, Food',
        'Transportation',
        'Evacuation Point, Medical, Food',
        'Shelter, Food'
    ];

    return (
        <div className="report_div">
            <h1>Report</h1>
            <form onSubmit={handleSubmit}>
                <section>First Name: <input type="text" required /></section>
                <section>Last Name: <input type="text" required /></section>
                <section>Personnel Type: <input type="text" required /></section>
                <section>Emergency: <input type="text" required /></section>
                <section>
                    Location: 
                    <input 
                        type="text" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                        required 
                    />
                </section>
                <section>
                    Date: <input type="date" required />
                    Time: <input type="time" required />
                </section>
                <section>
                    Services:
                    <select name="services" required>
                        <option value="">Select services</option>
                        {serviceOptions.map((service, index) => (
                            <option key={index} value={service}>
                                {service}
                            </option>
                        ))}
                    </select>
                </section>
                <section>Population: <input type="number" name="population" required min="0" /></section>
                <section>Hours: <input type="text" name="hours" required placeholder="e.g., 24/7 or 8AM-6PM" /></section>
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}