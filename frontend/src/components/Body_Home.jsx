//Le
//npm install @react-google-maps/api , react google api package
import "/frontend/css/Body_Home.css";
import Body_Home_Map from './Body_Home_Map';
import { useState, useEffect } from "react";

export default function Body_Home() {

    const [addresses, setAddresses] = useState([]);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
    const [addressesError, setAddressesError] = useState(null);

    useEffect(() => {
        const fetchAddresses = async () => {
            setIsLoadingAddresses(true);
            setAddressesError(null);
            try {
                const url = 'http://localhost:5002/api/allAddresses'
                const response = await fetch(url);
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Failed to fetch addresses list');
                setAddresses(data);
            } catch (err){
                setAddressesError(err.message);
                console.error("Error fetching addresses:" + err);
            } finally {
                setIsLoadingAddresses(false);
            }
        };
        fetchAddresses();
    }, []);

  if (isLoadingAddresses) return <div>Loading addresses...</div>;

  if (addressesError) return <div>Error: {addressesError}</div>;

    return (
        <Body_Home_Map addresses={addresses}/>
    );
};
