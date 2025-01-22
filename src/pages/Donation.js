import React, { useState } from 'react';
import Donation from '../components/Donation';
import Payment from '../components/Payment';
import SummaryDonations from '../components/SummaryDonations';
import { Container, Image } from 'react-bootstrap';
import logo from '../assets/gala_logo2025.png';
import backgroundImage from '../assets/container1.png'; // Certifique-se de ter a imagem de fundo no caminho correto

export default function DonationPage() {
  const [donation, setDonation] = useState({ name: 'DOAÇÃO', status: 'current' });
  const [payment, setPayment] = useState({ name: 'PAGAMENTO', status: 'upcoming' });
  const [summary, setSummary] = useState({ name: 'RESUMO', status: 'upcoming' });

  return (
    <Container fluid className="mx-auto">
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
        {[donation, payment, summary]
          .filter((step) => step.status === 'current')
          .map((step) => (
            <div key={step.name}>
              <span>{step.name}</span>
            </div>
          ))}
      </div>

      {/* Renderização condicional dos componentes */}
      <div>
        {donation.status === 'current' && (
          <Donation setDonation={setDonation} setPayment={setPayment} />
        )}
        {payment.status === 'current' && (
          <Payment setPayment={setPayment} setSummary={setSummary} payment={payment} />
        )}
        {summary.status === 'current' && <SummaryDonations />}
      </div>
    </Container>
  );
}
