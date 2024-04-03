import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css'; 

const Profile = () => {
  const [description, setDescription] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [hasProfile, setHasProfile] = useState(false); // Estado para verificar si el usuario tiene perfil
  const [isEditMode, setIsEditMode] = useState(false); // Estado para habilitar el modo de edición
  const [userId, setUserId] = useState(null); // Estado para almacenar el ID de usuario

  useEffect(() => {
    // Obtener el userId del localStorage al cargar el componente
    //console.log(localStorage.getItem('userId'));
    const userIdFromLocalStorage = localStorage.getItem('userId');
    if (userIdFromLocalStorage) {
        setUserId(userIdFromLocalStorage);
    }
}, []);

useEffect(() => {
    // Realizar una solicitud GET para obtener el perfil del usuario cuando userId se actualiza
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      // Simulamos una solicitud POST al endpoint para actualizar el perfil
      console.log(userId);
      const response = await axios.get(`http://localhost:8080/api/v1/user/profile?userId=${userId}`);

      const userProfileData = response.data;
      console.log(response.data);
      setDescription(userProfileData.description || ''); // Establecer la descripción del perfil, si está presente
      setProfilePictureUrl(userProfileData.profilePictureUrl || ''); // Establecer la URL de la imagen del perfil, si está presente
      setHasProfile(!!userProfileData.description || !!userProfileData.profilePictureUrl); // Verificar si el usuario tiene perfil
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Si la solicitud falla, se manejará aquí
    }
  };
  

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleProfilePictureUrlChange = (e) => {
    setProfilePictureUrl(e.target.value);
  };

  const handleEditProfile = () => {
    setIsEditMode(true); // Habilitar el modo de edición al hacer clic en modificar
  };

  const handleUpdateProfile = async () => {
    try {
      const userProfileData = {
        userId: userId,
        description: description,
        profilePictureUrl: profilePictureUrl,
      };
      const response = await axios.post("http://localhost:8080/api/v1/user/profile/update", userProfileData);
      console.log(response.data); // Manejar la respuesta según sea necesario
      setHasProfile(true); // Establecer que el usuario ahora tiene perfil después de actualizarlo
      setIsEditMode(false); // Deshabilitar el modo de edición después de actualizar el perfil
    } catch (error) {
      console.error('Error updating profile:', error);
      // Si la actualización falla, se manejará aquí
      if (error.response) {
        // Si hay una respuesta del servidor, imprimir el código de estado y los datos de la respuesta
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      } else if (error.request) {
        // Si la solicitud se realizó pero no se recibió respuesta, imprimir la solicitud
        console.error('Request:', error.request);
      } else {
        // Si ocurrió un error durante la configuración de la solicitud, imprimir el mensaje de error
        console.error('Error message:', error.message);
      }
    }
  };

  return (
    <div className="profile-wrapper">
        <h2 className="profile-title">Perfil</h2>
        {hasProfile && !isEditMode && (
            <div className="profile-content">
                <img src={profilePictureUrl} alt="Profile Picture" className="profile-image" />
                <p className="profile-description">{description}</p>
                <div className="profile-buttons">
                    <button className="profile-button" onClick={handleEditProfile}>Modificar</button>
                    <button className="profile-button" onClick={() => window.location.href = '/Home'}>Home</button>
                </div>
            </div>
        )}
        {!hasProfile && !isEditMode && (
            <div className="profile-content">
                <h2>¡Personaliza tu perfil!</h2>
                <p>Cuentanos algo sobre ti y elige una imagen para tu perfil.</p>
                <button className="profile-button" onClick={() => setIsEditMode(true)}>Personalizar</button>
            </div>
        )}
        {isEditMode && (
            <div className="profile-content">
                <h2>Actualiza tú perfil</h2>
                <label className="profile-input-label">Descripción:</label>
                <input className="profile-input-description" type="text" value={description} onChange={handleDescriptionChange} />
                <label className="profile-input-label">URL de la foto de perfil:</label>
                <input className="profile-input-url" type="text" value={profilePictureUrl} onChange={handleProfilePictureUrlChange} />
                <div className="profile-buttons">
                    <button className="profile-button" onClick={handleUpdateProfile}>Guardar</button>
                    <button className="profile-button" onClick={() => setIsEditMode(false)}>Cancelar</button>
                    <button className="profile-button" onClick={() => window.location.href = '/Home'}>Home</button>
                </div>
            </div>
        )}
    </div>
);
};

export default Profile;