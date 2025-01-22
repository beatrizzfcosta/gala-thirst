import React, { useState, useEffect } from 'react';
import { Container, Image, Button } from 'react-bootstrap';
import logo from '../assets/gala_logo2025.png';
import { Link } from 'react-router-dom';
import backgroundImage from '../assets/container1.png'; // Certifique-se de ter a imagem de fundo no caminho correto

export default function CountDown({ unavailable }) {
  const [days, setDays] = useState('00');
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');

  const countdownDate = new Date('2025-03-22 20:00:00').getTime();

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = countdownDate - now;

      const newDays = Math.floor(distance / (1000 * 60 * 60 * 24));
      const newHours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const newMinutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const newSeconds = Math.floor((distance % (1000 * 60)) / 1000);

      setDays(newDays.toString().padStart(2, '0'));
      setHours(newHours.toString().padStart(2, '0'));
      setMinutes(newMinutes.toString().padStart(2, '0'));
      setSeconds(newSeconds.toString().padStart(2, '0'));

      if (distance < 0) {
        clearInterval(countdownInterval);
        // You can add an action here when the countdown reaches zero

      }
    };

    updateCountdown(); // Initial update

    const countdownInterval = setInterval(updateCountdown, 1000);

    return () => {
      clearInterval(countdownInterval); // Clean up the interval when unmounting
    };
  }, []);

  return (
    <div className= "mx-auto flex flex-col justify-center items-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
    }}>
      <Container className="mx-auto px-14 py-7 flex flex-row justify-center home-page"  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    zIndex: 1,
                }}>
        <div className="text-start mb-4 flex flex-col first-col " style={{ width: '50%', justifyContent:'center' }}>
          <div className="flex flex-row countdown-container mb-5">
            <div className="countdown-box font-bold flex flex-col mr-3">
              <span className="text-white">{days}</span>
              <span className="text-xs mt-2">DIAS</span>
            </div>
            <h1 className="text-2xl font-bold mt-1
            ">
              :
            </h1>
            <div className="countdown-box font-bold flex flex-col ml-3 mr-3
            ">
              <span className="text-white">{hours}</span>
              <span className="text-xs mt-2">HORAS</span>
            </div>
            <h1 className="text-2xl font-bold mt-1
            ">
              :
            </h1>
            <div className="countdown-box font-bold flex flex-col ml-3 mr-3
            ">
              <span className="text-white">{minutes}</span>
              <span className="text-xs mt-2">MINUTOS</span>
            </div>
            <h1 className="text-2xl font-bold mt-1
            ">
              :
            </h1>
            <div className="countdown-box font-bold flex flex-col ml-3 
            ">
              <span className="text-white">{seconds}</span>
              <span className="text-xs mt-2">SEGUNDOS</span>
            </div>
          </div>
          <h3 className="text-thirst-darker-grey mt-10 text-sm font-bold">A MAIOR ORGANIZAÇÃO JOVEM DO MUNDO COM A MISSÃO DE ACABAR COM A CRISE MUNDIAL DE ÁGUA APRESENTA</h3>
          <h1 className="text-[#17CACE] text-4xl font-bold mt-4">SEGUNDA GALA THIRST PROJECT PORTUGAL</h1>
          <h3 className="block mt-4 text-lg font-bold text-[#17CACE]">
            22 de março | 20:00
          </h3>
          {unavailable ? (
            <Link to="/bilhetes/comprar">
              <Button
                className="rounded-sm justify-center mt-5 bg-black px-20 py-2 text-sm font-semibold text-white shadow-md hover:bg-[#17CACE] hover:text-white ring-2 ring-black hover:ring-[#17CACE] mb-5"
              >
                RESERVAR O MEU LUGAR!
              </Button>
            </Link>
          ) : (
            <Link to="/doacoes">
              <Button
                className="rounded-sm justify-center mt-5 bg-thirst-blue px-20 py-2 text-sm font-semibold text-white shadow-md ring-2 ring-thirst-blue"
              >
                BILHETES ESGOTADOS | DOAR AGORA
              </Button>
            </Link>
          )}
        </div>
        <div 
         style={{ width: '50%',justifyContent:'center', alignContent:'center'
         }}>
          <Image src={logo} alt="Thirst Gala" width={350} height={350} style={{ margin: "0 auto" }} />
        </div>
      </Container>
    </div>
  );
}
