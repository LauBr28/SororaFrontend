import {  useState } from "react";
import axios from "axios";
import fondo1 from '../assets/fondoWeb.png';
import { GrUserFemale } from "react-icons/gr";
import { GiHeartKey } from "react-icons/gi";
import './Register.css';
import { Link } from 'react-router-dom';

function Register() {
    const registerStyles = {
        backgroundImage: `url(${fondo1})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh', // Ajusta la altura según sea necesario
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        textAlign: 'center',
    };
    const [username, setUsername] = useState("");
    const [firstname, setFirstname] = useState("");
    const[lastname, setLastname]= useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showNotification, setShowNotification] = useState(false);
    
    async function save(event) {
        event.preventDefault();
        try {
            await axios.post("http://localhost:8080/api/v1/user/save", {
                username: username,
                firstname: firstname,
                lastname: lastname,  
                email: email, 
                password: password, 
                
            });
            setShowNotification(true); 
        } catch (err) {
            alert(err);
        }
    }



    return (
        <div className="wrapper">
            <form action="">
                <h1>Registrate</h1>
                <div className="input-box">
                    <input type="username" placeholder='Nombre de usuario' required

                        value={username}
                        onChange={(event) => {
                            setUsername(event.target.value);
                        }}

                    />
                    <GrUserFemale className="icon" />
                </div>
                <div className="input-box">
                    <input type="firstname" placeholder='Nombre' required

                        value={firstname}
                        onChange={(event) => {
                            setFirstname(event.target.value);
                        }}

                    />
                    <GrUserFemale className="icon" />
                </div>
                <div className="input-box">
                    <input type="lastname" placeholder='Apellido' required

                        value={lastname}
                        onChange={(event) => {
                            setLastname(event.target.value);
                        }}

                    />
                    <GrUserFemale className="icon" />
                </div>
                <div className="input-box">
                    <input type="email" placeholder='Email' required

                        value={email}
                        onChange={(event) => {
                            setEmail(event.target.value);
                        }}

                    />
                    <GrUserFemale className="icon" />
                </div>
                <div className="input-box">
                    <input type="password" placeholder='Password' required

                        value={password}
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}

                    />
                    <GiHeartKey className="icon" />
                </div>
                
                <button type="submit" class="btn btn-primary " onClick={save} >Save</button>

                <div className="register-link">
                    <p>¿Ya tienes cuenta? <Link to="/loginForm"><a className="chiqui">Login</a></Link></p>
                </div>
            </form>

            {showNotification && (
                <div className="notification">
                    <p>Registro de usuario exitoso</p>
                    <button onClick={() => setShowNotification(false)}>Cerrar</button>
                </div>
            )}
        </div>
    );
    }

    export default Register;