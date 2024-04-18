import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Maps.css'; 
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import L from "leaflet";

function LocationMarker() {
    const [position, setPosition] = useState(null);
    const map = useMap();

    useEffect(() => {
        map.locate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    map.on('locationfound', function(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
    });
    return position === null ? null : (
        
        <Marker position={position} icon={customIcon}>
            <Popup>Aquí estás</Popup>
        </Marker>
    );
}

const customIcon = L.icon({
    iconUrl: markerIconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

const Maps = () => {
    return (
        <MapContainer
            center={{ lat: 4.6534, lng: -74.0837 }}
            zoom={15}
            scrollWheelZoom={false} className='mapa'>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
        </MapContainer>
    );
};

export default Maps;
