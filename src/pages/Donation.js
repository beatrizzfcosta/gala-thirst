import React, { useState } from 'react';
import Donation from '../components/Donation';
import Payment from '../components/Payment';
import SummaryDonations from '../components/SummaryDonations';
import { Image } from 'react-bootstrap';
import logo from '../assets/gala_logo2025.png';
import backgroundImage from '../assets/container1.png'; // Certifique-se de ter a imagem de fundo no caminho correto
import '../style/header.css'

export default function DonationPage() {
  const [donation, setDonation] = useState({ name: 'DOAÇÃO', status: 'current' });
  const [payment, setPayment] = useState({ name: 'PAGAMENTO', status: 'upcoming' });
  const [summary, setSummary] = useState({ name: 'RESUMO', status: 'upcoming' });

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
        className="blue-bar"
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
    </div>
  );
}
