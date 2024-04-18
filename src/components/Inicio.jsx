// Inicio.jsx

import React from 'react';
import { Link } from 'react-router-dom'; // Importa Link de react-router-dom;
import './Inicio.css';

const Inicio = () => {
    const homeStyles = {
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh', // Ajusta la altura según sea necesario
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        textAlign: 'center',
    };

    return (
        <div className="wrapper" style={homeStyles}>
            <header className="titulo">
                <h1>SORORA</h1>
            </header>
            <main>
                <p>¡Bienvenida a tu espacio! Únete a nuestra comunidad donde la sororidad nos hará construir un mejor futuro.</p>
            </main>
            <footer>
                <Link to="/register"><button>Registro</button></Link>
                <Link to="/loginForm"><button>Iniciar sesión</button></Link>
            </footer>
            <p className="texto-pequeno">"De ellas y para ellas"</p>

        </div>

    );
};

export default Inicio; // Exporta el componente 'Inicio' como default

