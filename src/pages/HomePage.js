import React from 'react';
import { Image, Button } from 'react-bootstrap';
import logo from '../assets/gala_logo2025.png';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/container1.png'; // Certifique-se de ter a imagem de fundo no caminho correto
import '../style/homePage.css'
export default function HomePage() {
    return (
        <div
            className='background'
            style={{
                backgroundImage: `url(${backgroundImage})`,
            }}
        >
            <div className='overlay'/>
            <div className="container-img-homePage">         
                <Image className="logo" src={logo} alt="Thirst Gala" width={350} height={350} />
            </div>
            <div className="container-button-homePage">
                
                    <Button className='button'>DOAR</Button>
                
            </div>
        </div>
    )
}
