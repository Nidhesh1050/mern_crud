import React, { useState } from "react";
import { Link } from "react-router-dom";
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg'; // Adjusted import
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import axios from 'axios'

function ThreeDViewer() {
    const [image, setImage] = useState()
    const [model, setModel] = useState(null); // Added state for the model


    const onSubmit = (e) =>{
        e.preventDefault();
        if(image){
            const formData=new FormData();
            formData.append('image',image);

        axios.post("http://localhost:3001/uploadImage", formData)
        .then(result => {
            console.log(result)
            navigate('/')
        })
        .catch(err => console.log(err))
    }
}

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const fileExtension = file.name.split('.').pop();

        const reader = new FileReader();
        reader.onload = (e) => {
            if (fileExtension === 'glb' || fileExtension === 'gltf') {
                const loader = new GLTFLoader();
                loader.parse(e.target.result, '', (gltf) => {
                    setModel(gltf.scene);
                });
            } else if (fileExtension === 'obj') {
                const loader = new OBJLoader();
                loader.load(URL.createObjectURL(file), (obj) => {
                    setModel(obj);
                });
            } else {
                alert('Unsupported file type. Please upload .obj or .glb files.');
            }
        };
        reader.readAsArrayBuffer(file);
    };

    // return (
    //     <>
    //         <h1>3D Viewer</h1>
    //         {/* <input type="file" accept=".obj,.glb,.gltf" onChange={handleFileChange} /> */}
    //         <form onSubmit={onSubmit} method="POST" enctype="multipart/form-data">
    //             <input type="file" name="image" accept=".obj,.glb,.gltf" 
    //              onChange={(e) => setImage(e.target.value)} />
    //             {/* onChange={handleFileChange} */}
    //             <button type="submit">Upload Image</button>
    //         </form>
    //         <Canvas>
    //             <OrbitControls enableZoom={true} enablePan={true} />
    //             <Environment preset="sunset" />
    //             {/* {model && <primitive object={model} />} */}
    //         </Canvas>
    //     </>
    // );
    return (
        <>
            <h1>3D Viewer</h1>
            <form onSubmit={onSubmit}>
                <input 
                    type="file" 
                    accept=".obj,.gltf,.glb" 
                    onChange={handleFileChange} 
                />
                <input 
                    type="file" 
                    onChange={(e) => setImage(e.target.files[0])} 
                />
                <button type="submit">Upload Image</button>
            </form>
            {model && (
                <Canvas>
                    <ambientLight />
                    <pointLight position={[10, 10, 10]} />
                    <primitive object={model} />
                       <OrbitControls enableZoom={true} enablePan={true} />
                       <Environment preset="sunset" />
                </Canvas>
            )}
        </>
    );
}

export default ThreeDViewer;