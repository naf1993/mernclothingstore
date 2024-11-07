import React, { useEffect, useState,useCallback } from "react";
import toast from "react-hot-toast";
import debounce from 'lodash.debounce'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvent,
} from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSelector } from "react-redux";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
// Make sure the marker icon images are imported correctly
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
const defaultIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41], // Anchor the icon so that the "tip" is at the correct point
  popupAnchor: [1, -34], // Popup positioning
  shadowSize: [41, 41],
});

const ShippingAddress = ({ address, setAddress }) => {
  const MAPBOX_API_KEY = process.env.REACT_APP_MAPBOX_API_KEY;
  const user = useSelector((state) => state.user);
  const { user: loggedInUser } = user;
  const { name } = loggedInUser;

  const [userPosition, setUserPosition] = useState(null);
  const [localAddress, setLocalAddress] = useState(address);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition({ lat: latitude, lng: longitude });
          getAddressFromCoordinates(latitude, longitude);
        },
        (err) => {
          toast.error("Error getting location", err);
        }
      );
    } else {
      toast.error("Geolocation not supported");
    }
  }, []);

  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const result = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_API_KEY}&language=en`
      );
      if (result.data.features.length > 0) {
        const feature = result.data.features[0];
        const streetName = feature.place_name_en || feature.text;

        // Update the local address state
        const updatedAddress = {
          ...localAddress,
          fullName: name,
          streetName: streetName,
          city: getAddressComponent(feature, "place"),
          country: getAddressComponent(feature, "country"),
          postalCode:
            getAddressComponent(feature, "postcode") || "Not available",
          lat,
          lng,
        };

        // Set the local address and also update the parent component if needed
        setLocalAddress(updatedAddress);
        setAddress(updatedAddress); // Update the parent state (if applicable)
      }
    } catch (error) {
      toast.error("Error fetching location");
    }
  };

  const getAddressComponent = (component, type) => {
    const found = component.context.find((context) =>
      context.id.includes(type)
    );
    return found ? found.text : "";
  };

  const mapClickHandler = (e) => {
    console.log("Map clicked!", e.latlng);
    const { lat, lng } = e.latlng;
    setUserPosition({ lat, lng });
    getAddressFromCoordinates(lat, lng);
  };

  // Attach the map click event listener using useMapEvent
  const MapClickListener = () => {
    useMapEvent("click", mapClickHandler);
    return null;
  };
  // Custom hook to force map re-centering when position changes

  const handleSearchChange = debounce(async (query) => {
    setSearchQuery(query)
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }
    console.log('Searching for',query)
    const boundingBox = [-125, 24, -66, 50];
    try {
      const result = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`, {
            params: {
                access_token: MAPBOX_API_KEY,
                proximity: userPosition ? `${userPosition.lng},${userPosition.lat}` : undefined, // Optional: if you have a user's location, use proximity for better suggestions
                bbox: boundingBox,  // Use the bounding box to limit the search area (optional)
                limit: 5,            // Limit the number of results to return
                types: 'place,address', // Filter by 'place' and 'address' (optional)
                language: 'en'       // Set the language for the results
            }
        }
    );
      const newSuggestions = result.data.features.map((feature) => ({
        label: feature.place_name,
        value: feature.center,
      }));
      setSuggestions(newSuggestions);
    } catch (error) {
      toast.error("Error fetching search results.");
    }
  },300)

  const handleSelectLocation = (selectedOption) => {
    setSelectedLocation(selectedOption);
    const [lng, lat] = selectedOption.value;

    // Set the map view to the selected location
    setUserPosition({ lat, lng });
    getAddressFromCoordinates(lat, lng); // Fetch and update address for the selected location
  };

  const UpdateMapCenter = () => {
    const map = useMap();
    useEffect(() => {
      if (selectedLocation || userPosition) {
        map.setView(
          selectedLocation
            ? { lat: selectedLocation.value[1], lng: selectedLocation.value[0] }
            : userPosition,
          13
        );
      }
    }, [selectedLocation, userPosition, map]);
    return null;
  };

  return (
    <div className="address-wrapper">
      

      <div className="address-wrapper__left">
        <MapContainer
          center={userPosition || { lat: 51.505, lng: -0.09 }}
          zoom={13}
          style={{ width: "100%", height: "350px" }}
        >
          <TileLayer
            url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${process.env.REACT_APP_MAPBOX_API_KEY}`}
            id="mapbox/streets-v11"
            tileSize={512}
            zoomOffset={-1}
          />
          {/* Marker for user position */}
          {userPosition && (
            <Marker position={userPosition} icon={defaultIcon}>
              <Popup>
                You are here!
                <br />
                Latitude: {userPosition.lat}
                <br />
                Longitude: {userPosition.lng}
              </Popup>
            </Marker>
          )}

          {/* Marker for searched location */}
          {selectedLocation && (
            <Marker
              position={{
                lat: selectedLocation.value[1],
                lng: selectedLocation.value[0],
              }}
              icon={defaultIcon}
            >
              <Popup>
                Selected Location!
                <br />
                Latitude: {selectedLocation.value[1]}
                <br />
                Longitude: {selectedLocation.value[0]}
              </Popup>
            </Marker>
          )}

          {/* Update the map center based on position */}
          <UpdateMapCenter />
          <MapClickListener />
        </MapContainer>
      </div>
      
      <div className="address-wrapper__right">
      <input
          type="text"
          value={searchQuery}  // Bind the input value to searchQuery state
          onChange={(e) => handleSearchChange(e.target.value)}  // Update search query on change
          placeholder="Search for a location"
        />
        {suggestions && suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSelectLocation(suggestion)}>
                {suggestion.label}
              </li>
            ))}
          </ul>
        )}
      
      <form>
        
          <input
            type="text"
            placeholder="Full Name"
            value={localAddress.fullName}
            onChange={(e) =>
              setLocalAddress({ ...localAddress, fullName: e.target.value })
            }
          />
      
          <input
            type="text"
            placeholder="Street Name"
            value={localAddress.streetName}
            onChange={(e) =>
              setLocalAddress({ ...localAddress, streetName: e.target.value })
            }
          />
       
          <input
            type="text"
            placeholder="City"
            value={localAddress.city}
            onChange={(e) =>
              setLocalAddress({ ...localAddress, city: e.target.value })
            }
          />
       
          <input
            type="text"
            placeholder="Country"
            value={localAddress.country}
            onChange={(e) =>
              setLocalAddress({ ...localAddress, country: e.target.value })
            }
          />
      
          <input
            type="text"
            placeholder="Postal Code"
            value={localAddress.postalCode}
            onChange={(e) =>
              setLocalAddress({ ...localAddress, postalCode: e.target.value })
            }
          />
      
      </form>
      </div>
    </div>
  );
};

export default ShippingAddress;
