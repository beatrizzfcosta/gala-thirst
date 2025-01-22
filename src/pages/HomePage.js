import React from 'react';
import { Container, Image, Button } from 'react-bootstrap';
import logo from '../assets/gala_logo2025.png';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/container1.png'; // Certifique-se de ter a imagem de fundo no caminho correto

export default function HomePage() {
    return (
        <Container
            className="mx-auto flex flex-col justify-center"
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                width: '100%',
            }}
        >
            {/* Overlay */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#fff',
                    opacity: 0.9, // Ajuste a opacidade conforme necessário
                    zIndex: 1,
                }}
            />
            <div className="text-center mt-14 mb-4" 
            style={{
                zIndex:2,
            }}>
                <Image src={logo} alt="Thirst Gala" width={350} height={350} style={{ margin: "0 auto" }} />
            </div>
            <div className="text-center mb-4" style={{
                zIndex:2,
            }}>
                <Link to="/doacoes/doar">
                    <Button
                        className="rounded-sm justify-center mt-10 bg-black px-20 py-2 text-sm font-semibold text-white shadow-md hover:bg-[#17CACE] hover:text-white"
                        style={{ width: '75%' }}
                    >
                        DOAR
                    </Button>
                </Link>
            </div>
        </Container>
    )
}
