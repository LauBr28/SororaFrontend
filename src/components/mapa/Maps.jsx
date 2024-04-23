import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Maps.css'; 
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import L from "leaflet";

const customIcon = L.icon({
    iconUrl: markerIconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

const Maps = ({ userLocations, userId }) => {
    console.log(userId);
    return (
        <MapContainer
            center={{ lat: 4.6534, lng: -74.0837 }}
            zoom={15}
            scrollWheelZoom={false} className='mapa'>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {userLocations.map((location, index) => (
                <Marker
                    key={index}
                    position={{ lat: location.latitud, lng: location.longitud }}
                    icon={location.userId === userId ? customIconViolet : customIcon}
                >
                    <Popup>{`${location.userId === userId ? 'Este eres tu' : 'Usuario ' + location.userId}`}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

const customIconViolet = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

export default Maps;

