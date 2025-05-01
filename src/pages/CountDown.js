import React, { useState, useEffect } from 'react';
import { Image, Button, Alert } from 'react-bootstrap';
import logo from '../assets/gala_logo2025.png';
import { Link, useLocation } from 'react-router-dom';
import backgroundImage from '../assets/container1.png';
import '../style/pCountDown.css'

export default function CountDown({ unavailable }) {
  const [days, setDays] = useState('00');
  const [hours, setHours] = useState('00');
  const [minutes, setMinutes] = useState('00');
  const [seconds, setSeconds] = useState('00');
  const [alertMessage, setAlertMessage] = useState(null); // Estado para exibir a notificação

  const location = useLocation(); // Obtém os parâmetros da URL
  const countdownDate = new Date('2025-05-24 20:00:00').getTime();


  useEffect(() => {
    // Capturar status da URL
    const searchParams = new URLSearchParams(location.search);
    const status = searchParams.get("status");

    if (status === "success") {
      setAlertMessage({ type: "success", text: "✅ Compra efetuada com sucesso!" });
    } else if (status === "fail") {
      setAlertMessage({ type: "danger", text: "❌ Ocorreu um erro no pagamento. Tente novamente!" });
    }

    if (status) {
      setTimeout(() => setAlertMessage(null), 5000); // Esconde a notificação após 5 segundos
    }
  }, [location]);

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
    <div
      className='background2'
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className='overlay' />
      {/* Notificação de pagamento */}
      {alertMessage && (
        <Alert variant={alertMessage.type} className="alert-top">
          {alertMessage.text}
        </Alert>
      )}
      <div className='row1'>
        <div className="countdown">
          <div className="countdown-box">
            <span className="number">{days}</span>
            <span className="title">DIAS</span>
          </div>
          <h1 className="tab">
            :
          </h1>
          <div className="countdown-box">
            <span className="number">{hours}</span>
            <span className="title">HORAS</span>
          </div>
          <h1 className="tab">
            :
          </h1>
          <div className="countdown-box">
            <span className="number">{minutes}</span>
            <span className="title">MINUTOS</span>
          </div>
          <h1 className="tab">
            :
          </h1>
          <div className="countdown-box">
            <span className="number">{seconds}</span>
            <span className="title">SEGUNDOS</span>
          </div>
        </div>
        <h3 className="subtext">A MAIOR ORGANIZAÇÃO JOVEM DO MUNDO COM A MISSÃO DE ACABAR COM A CRISE MUNDIAL DA ÁGUA APRESENTA</h3>
        <h1 className="text">II GALA THIRST PROJECT PORTUGAL</h1>
        <h3 className="date">
          24 de maio | 20:00
        </h3>
        {unavailable ? (
          <div className="countdown-button" >
            <Link to="/bilhetes/comprar">
              <Button
                className="button2"
              >
                RESERVAR O MEU LUGAR!
              </Button>
            </Link>
            <Link to="/doacoes/doar">
              <Button className='button2'>DOAR AGORA</Button>
            </Link>
          </div>
        ) : (
          <div className="countdown-button" >
            <Link to="/doacoes">
              <Button
                className="button2"
              >
                BILHETES ESGOTADOS | DOAR AGORA
              </Button>
            </Link>
          </div>
        )}
      </div>
      <div className="row2">
        <div className="image-countdown" style={{
          backgroundImage: `url(${logo})`,
        }}> </div>

      </div>

    </div>
  );
}
