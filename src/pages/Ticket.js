import React, { useState } from 'react';
import Ticket from '../components/Ticket';
import Contribution from '../components/Contribution';
import Info from '../components/Info';
import Summary from '../components/Summary';
import { Container, Image } from 'react-bootstrap';
import logo from '../assets/gala_logo2025.png';
import backgroundImage from '../assets/container1.png'; // Certifique-se de ter a imagem de fundo no caminho correto

export default function TicketPage() {
    const [ticket, setTicket] = useState({ name: 'BILHETE', status: 'current' });
    const [contribution, setContribution] = useState({ name: 'CONTRIBUIÇÃO', status: 'upcoming' });
    const [info, setInfo] = useState({ name: 'INFO & PAGAMENTO', status: 'upcoming' });
    const [summary, setSummary] = useState({ name: 'RESUMO', status: 'upcoming' });

    return (
      <Container className="mx-auto ">
         <div
        className="text-center"
        style={{
          position: 'relative',
          width: '100%',
          height: '30%',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: '#fff',
            opacity: 0.9, // Ajuste a opacidade conforme necessário
            zIndex: 1,
          }}
        />
        {/* Logo */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            padding: '20px 0',
          }}
        >
          <Image src={logo} alt="Thirst Gala" width={200} height={200} style={{ margin: '0 auto' }} />
        </div>
      </div>
      {/* Barra azul */}
      <div
        className="flex justify-center items-center text-white font-bold text-lg"
        style={{ backgroundColor: '#17CACE', padding: '10px 0' }}
      >
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
      </Container>
    )
  }