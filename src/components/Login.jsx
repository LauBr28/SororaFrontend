import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import fondo1 from '../assets/fondo1.png';
import './Login.css';


function Login() {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showNotification, setShowNotification] = useState(false); 
    const navigate = useNavigate();

    async function login(event) {
        event.preventDefault();
        try {
            await axios.post("http://localhost:8080/api/v1/user/login", {
                email: email,
                password: password,
            }).then((res) => {
                console.log(res.data);

                if (res.data.message == "Email not exits") {
                    setShowNotification(true); 
                }
                else if (res.data.message == "Login Success") {
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
    const loginStyles = {
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
    return (
        <div style={loginStyles}>
            <div class="container">
                <div class="row">
                    <h2>Login</h2>
                    <hr />
                </div>
                <div class="row">
                    <div class="col-sm-6">
                        <form>
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" class="form-control" id="email" placeholder="Enter Name"

                                    value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                    }}

                                />
                            </div>
                            <div class="form-group">
                                <label>password</label>
                                <input type="password" class="form-control" id="password" placeholder="Enter Fee"

                                    value={password}
                                    onChange={(event) => {
                                        setPassword(event.target.value);
                                    }}

                                />
                            </div>
                            <button type="submit" class="btn btn-primary" onClick={login} >Login</button>
                        </form>             
                    </div>
                </div>
                {(showError && !showNotification) && ( // Mostrar el mensaje de error solo si no se muestra la notificación de email no existente
                <div className="notification">
                    <p>Incorrect Email and Password not match</p>
                    <button onClick={() => setShowError(false)}>Close</button>
                </div>
            )}
            </div>
        </div>

       
    );    
}

export default Login;