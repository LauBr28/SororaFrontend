import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'
import Mapas from "../mapa/Maps.css"; 
import L from 'leaflet';
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-icon.png";

let iconUbicacion = new L.icon({
    iconUrl: icon,
    iconShadow: iconShadow,
    iconSize: [20, 30],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76]
});

const Maps = () => {
    return(
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} className='mapa'>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[51.505, -0.09]} icon={iconUbicacion}>
                <Popup>
                    Aqui estas
                </Popup>
            </Marker>
        </MapContainer>
    )
}

export default Maps; 