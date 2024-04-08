import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import "./maps.css"
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let iconUbicacion = new L.icon({
    iconUrl: icon,
    iconShadow: iconShadow,
    iconSize: [20, 30],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});

const Maps = () => {
    const [userLocation, setUserLocation] = useState([4.664029951910404, -74.09179687500001]);

    useEffect(() => {
        const fetchUserLocation = () => {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation([latitude, longitude]);
                },
                error => {
                    console.error('Error fetching user location:', error);
                }
            );
        };

        fetchUserLocation();
    }, []);

    return (
        <MapContainer center={userLocation} zoom={13} scrollWheelZoom={false} className='mapa'>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={userLocation} icon={iconUbicacion}>
                <Popup>
                    Aquí estás
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default Maps;