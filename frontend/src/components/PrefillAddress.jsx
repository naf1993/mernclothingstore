import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';

// You need to import the Leaflet CSS to properly display the map
import 'leaflet/dist/leaflet.css';

const PrefillAddress = () => {
  const [address, setAddress] = useState({
    fullName: '',
    streetName: '',
    city: '',
    country: '',
    postalCode: '',
    lat: null,
    lng: null,
  });

  const [userPosition, setUserPosition] = useState(null);

  useEffect(() => {
    // Get user's current location using geolocation API
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition({ lat: latitude, lng: longitude });
          getAddressFromCoordinates(latitude, longitude);
        },
        (err) => {
          console.log("Error getting location: ", err);
        }
      );
    } else {
      console.log("Geolocation not supported");
    }
  }, []);

  // Use a reverse geocoding service to get the address from lat/lng
  const getAddressFromCoordinates = async (lat, lng) => {
    const MAPBOX_API_KEY = 'YOUR_MAPBOX_API_KEY';  // Use your Mapbox API key here
    try {
      const result = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_API_KEY}`
      );
      if (result.data.features.length > 0) {
        const addressComponents = result.data.features[0].address;
        setAddress({
          ...address,
          streetName: addressComponents,
          city: getAddressComponent(result.data.features[0], 'place'),
          country: getAddressComponent(result.data.features[0], 'country'),
          postalCode: getAddressComponent(result.data.features[0], 'postcode'),
          lat,
          lng,
        });
      }
    } catch (error) {
      console.error("Error fetching address from Mapbox API:", error);
    }
  };

  const getAddressComponent = (component, type) => {
    const found = component.context.find((context) => context.id.includes(type));
    return found ? found.text : '';
  };

  // Handle map clicks to update the address and position
  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setUserPosition({ lat, lng });
    getAddressFromCoordinates(lat, lng);
  };

  return (
    <div>
      <h2>Prefill Address</h2>
      <MapContainer
        center={userPosition || { lat: 51.505, lng: -0.09 }} // Default to London if location not available
        zoom={13}
        style={{ width: '100%', height: '500px' }}
        onClick={handleMapClick}
      >
        <TileLayer
          url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=YOUR_MAPBOX_API_KEY"
          id="mapbox/streets-v11"  // You can choose different Mapbox styles
          tileSize={512}
          zoomOffset={-1}
        />
        {userPosition && (
          <Marker position={userPosition}>
            <Popup>
              You are here!<br />
              Latitude: {userPosition.lat}<br />
              Longitude: {userPosition.lng}
            </Popup>
          </Marker>
        )}
      </MapContainer>

      <form>
        <div>
          <input
            type="text"
            placeholder="Full Name"
            value={address.fullName}
            onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Street Name"
            value={address.streetName}
            onChange={(e) => setAddress({ ...address, streetName: e.target.value })}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="City"
            value={address.city}
            onChange={(e) => setAddress({ ...address, city: e.target.value })}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Country"
            value={address.country}
            onChange={(e) => setAddress({ ...address, country: e.target.value })}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Postal Code"
            value={address.postalCode}
            onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
          />
        </div>
      </form>
    </div>
  );
};

export default PrefillAddress;
