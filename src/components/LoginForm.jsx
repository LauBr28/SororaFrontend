import React from "react";
import './LoginForm.css';
import { GrUserFemale } from "react-icons/gr";
import { GiHeartKey } from "react-icons/gi";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Link } from 'react-router-dom';

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();
    async function login(event) {
        event.preventDefault();
        try {
            await axios.post("http://localhost:8080/api/v1/user/login", {
                email: email,
                password: password,
            }).then((res) => {
                console.log(res.data);

                if (res.data.message === "Email not exits") {
                    setShowError(true);
                }
                else if (res.data.message === "Login Success") {
                    console.log( res.data.id);
                    localStorage.setItem('userId', res.data.id);
                    navigate('/home');
                }
                else {
                    setShowError(true);
                }
            }, fail => {
                console.error(fail); // Error!
            });
        }

        catch (err) {
            alert(err);
        }

    }
    return (
        <div className="wrapper">
            <form action="">
                <h1>Login</h1>
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
                <button type="submit" class="btn btn-primary " onClick={login} >Login</button>

                <div className="register-link">
                    <p>¿No tiene una cuenta? <Link to="/register" className="chiqui">Registro</Link></p>
                </div>
            </form>
            {showError && (
                <div className="notification">
                    <p>Correo o contraseña incorrecta</p>
                    <button onClick={() => setShowError(false)}>Close</button>
                </div>
            )}
        </div>
     
    );
};

export default LoginForm;