import React, { useState } from 'react';
import Ticket from '../components/Ticket';
import Contribution from '../components/Contribution';
import Info from '../components/Info';
import Summary from '../components/Summary';
import { Image } from 'react-bootstrap';
import logo from '../assets/gala_logo2025.png';
import backgroundImage from '../assets/container1.png'; // Certifique-se de ter a imagem de fundo no caminho correto
import '../style/header.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';


export default function TicketPage() {
  const [ticket, setTicket] = useState({ name: 'BILHETE', status: 'current' });
  const [contribution, setContribution] = useState({ name: 'CONTRIBUIÇÃO', status: 'upcoming' });
  const [info, setInfo] = useState({ name: 'INFO & PAGAMENTO', status: 'upcoming' });
  const [summary, setSummary] = useState({ name: 'RESUMO', status: 'upcoming' });

  const goBack = () => {
    if (summary.status === 'current') {
      setSummary({ ...summary, status: 'upcoming' });
      setInfo({ ...info, status: 'current' });
    } else if (info.status === 'current') {
      setInfo({ ...info, status: 'upcoming' });
      setContribution({ ...contribution, status: 'current' });
    } else if (contribution.status === 'current') {
      setContribution({ ...contribution, status: 'upcoming' });
      setTicket({ ...ticket, status: 'current' });
    }
  };

  return (
    <div>
      <div className="header" style={{ backgroundImage: `url(${backgroundImage})`, }}>
        <div className='overlay-header' />
        {/* Logo */}
        <div className="logo-header">
          <Image className="img" src={logo} alt="Thirst Gala" width={200} height={200} style={{ margin: '0 auto' }} />
        </div>
      </div>
      {/* Barra azul */}
      <div
        className="blue-bar">
        {ticket.status !== 'current' && (
          <button className="back-button" onClick={goBack}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        )}
        {[ticket, contribution, info, summary]
          .filter((step) => step.status === 'current')
          .map((step) => (
            <div key={step.name}>
              <span>{step.name}</span>
            </div>
          ))}
      </div>
      {ticket.status === 'current' && (
        <Ticket setTicket={setTicket} setContribution={setContribution} />
      )}
      {contribution.status === 'current' && (
        <Contribution contribution={contribution} setContribution={setContribution} setInfo={setInfo} />
      )}
      {info.status === 'current' && (
        <Info setInfo={setInfo} setSummary={setSummary} contribution={contribution} />
      )}
      {summary.status === 'current' && (
        <Summary setSummary={setSummary} summary={summary} />
      )}
    </div>
  )
}