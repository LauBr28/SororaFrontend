import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './maps.css'; 
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import L from "leaflet";
import axios from 'axios';

const customIcon = L.icon({
    iconUrl: 'https://freepngimg.com/save/31319-ryan-gosling-transparent/500x449',
    //iconSize: [25, 41],
    iconSize: [55, 70],
    //iconAnchor: [12, 41],
    iconAnchor: [12, 61],
    popupAnchor: [1, -34]
});

const customIconViolet = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

const customIconGray = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});


const Maps = ({ userLocations, userId }) => {
    console.log(userId);
    const [amigas, setAmigas] = useState([]);

    useEffect(() => {
        const fetchAmigas = async (userId) => {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/user/friends?userId=${userId}`);
                setAmigas(response.data);
            } catch (error) {
                console.error('Error fetching amigas:', error);
            }
        };
        
        fetchAmigas(userId);
    }, [userId]);

    const isAmiga = (userId) => {
        return amigas.some(amiga => amiga.id === userId);
    };

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
                    icon={location.userId === userId ? customIconViolet : isAmiga(location.userId)
                        ? customIcon : customIconGray}
                >
                    <Popup>
                        {location.userId === userId
                            ? 'Este eres tu'
                            : isAmiga(location.userId)
                                ? 'Amiga'
                                : 'Usuario ' + location.userId}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};


export default Maps;