import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css'; 

const Profile = () => {
  const [user, setUser] = useState(null); // Estado para almacenar los detalles del usuario
  const [isEditMode, setIsEditMode] = useState(false); // Estado para habilitar el modo de edición
  const [description, setDescription] = useState(''); // Estado para descripción del perfil
  const [profilePictureUrl, setProfilePictureUrl] = useState(''); // Estado para URL de la imagen de perfil

  useEffect(() => {
    // Obtener el userId del localStorage al cargar el componente
    const userIdFromLocalStorage = localStorage.getItem('userId');
    if (userIdFromLocalStorage) {
        fetchUserProfile(userIdFromLocalStorage);
    }
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/user/profile?userId=${userId}');
      const userProfileData = response.data;
      setUser(userProfileData); // Establecer los detalles del usuario
      setDescription(userProfileData.userProfileDto.description || ''); // Establecer la descripción del perfil, si está presente
      setProfilePictureUrl(userProfileData.userProfileDto.profilePictureUrl || ''); // Establecer la URL de la imagen del perfil, si está presente
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleEditProfile = () => {
    setIsEditMode(true); // Habilitar el modo de edición al hacer clic en modificar
  };

  const handleCancelEdit = () => {
    setIsEditMode(false); // Deshabilitar el modo de edición al hacer clic en cancelar
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value); // Actualizar la descripción del perfil
  };

  const handleProfilePictureUrlChange = (e) => {
    setProfilePictureUrl(e.target.value); // Actualizar la URL de la imagen del perfil
  };

  const handleSaveProfile = async () => {
    try {
      const userProfileData = {
        userId: user.id,
        description: description,
        profilePictureUrl: profilePictureUrl,
      };
      const response = await axios.post("http://localhost:8080/api/v1/user/profile/update", userProfileData);
      console.log(response.data); // Manejar la respuesta según sea necesario
      setUser(prevUser => ({
        ...prevUser,
        userProfileDto: {
          ...prevUser.userProfileDto,
          description: description,
          profilePictureUrl: profilePictureUrl,
        }
      }));
      setIsEditMode(false); // Deshabilitar el modo de edición después de actualizar el perfil
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="profile-wrapper">
        {user && !isEditMode && (
            <div className="profile-content">
                <h2 className="profile-username">{user.username}</h2> {/* Título con el nombre de usuario */}
                <img src={user.userProfileDto.profilePictureUrl} alt="Profile Picture" className="profile-image" />
                <p className="profile-description">{user.userProfileDto.description}</p>
                <p className="profile-email">{user.email}</p>
                <div className="profile-buttons">
                    <button className="profile-button" onClick={handleEditProfile}>Modificar</button>
                    <button className="profile-button" onClick={() => window.location.href = '/Home'}>Home</button>
                </div>
            </div>
        )}
        {isEditMode && (
            <div className="profile-content">
                <h2>Actualiza tu perfil</h2>
                <label className="profile-input-label">Descripción:</label>
                <input className="profile-input-description" type="text" value={description} onChange={handleDescriptionChange} />
                <label className="profile-input-label">URL de la foto de perfil:</label>
                <input className="profile-input-url" type="text" value={profilePictureUrl} onChange={handleProfilePictureUrlChange} />
                <div className="profile-buttons">
                    <button className="profile-button" onClick={handleSaveProfile}>Guardar</button>
                    <button className="profile-button" onClick={handleCancelEdit}>Cancelar</button>
                    <button className="profile-button" onClick={() => window.location.href = '/Home'}>Home</button>
                </div>
            </div>
        )}
    </div>
  );
};

export default Profile;