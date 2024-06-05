// src/components/ImageVerification.js
import React, { useState } from 'react';


///////////////////////////////////////////////////////////////////////////////////////////////////
// In this section, we set the user authentication, user and app ID, model details, and the URL
// of the image we want as an input. Change these strings to run your own example.
const ImgUrl = 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?cs=srgb&dl=pexels-olly-733872.jpg&fm=jpg';
//////////////////////////////////////////////////////////////////////////////////////////////////
const ReturnClarifaiJSONRequest = (ImgUrl) => {
    // Your PAT (Personal Access Token) can be found in the Account's Security section
    const PAT = 'ff3c07d75a92412b96dfea0b87d58356';
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = 'lausofismedina';
    const APP_ID = 'my-first-application-anep1l';
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = 'ff83d5baac004aafbe6b372ffa6f8227';
    const IMAGE_URL = ImgUrl;


    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });

    return {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

}



const ImageVerification = () => {
    const [imageUrl, setImageUrl] = useState('');
    const [verificationResult, setVerificationResult] = useState(null);

    const handleInputChange = (event) => {
        setImageUrl(event.target.value);
    };

    const handleVerifyClick = () => {
        const requestOptions = ReturnClarifaiJSONRequest(imageUrl);

        fetch(`https://api.clarifai.com/v2/models/gender-demographics-recognition/outputs`, requestOptions)
            .then(response => response.json())
            .then(result => {
                const feminineValue = result.outputs[0].data.concepts.find(concept => concept.name === 'Feminine').value;
                setVerificationResult(feminineValue > 0.8 ? 'Verificada' : 'No verificada');
                console.log(feminineValue > 0.8 ? 'Verificada' : 'No verificada');
            })
            .catch(error => {
                console.log('error', error);
                setVerificationResult('Error en la verificación');
            });
    };

    return (
        <div>
            <h2>Pon el link a la imagen que deseas verificar</h2>
            <input
                type="text"
                placeholder="Introduce el enlace de la imagen"
                value={imageUrl}
                onChange={handleInputChange}
            />
            <button onClick={handleVerifyClick}>Verificar</button>
            {imageUrl && <div>
                <h3>Imagen a verificar:</h3>
                <img src={imageUrl} alt="Imagen a verificar" style={{ width: '300px', height: 'auto' }} />
            </div>}
            {verificationResult && <h3 style={{ color: verificationResult === 'Verificada' ? 'green' : 'red' }}>
                {verificationResult}
            </h3>}
        </div>
    );
};

export default ImageVerification;