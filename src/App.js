import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './style/App.css';

import DonationPage from './pages/Donation';
import HomePage from './pages/HomePage';
import CountDown from './pages/CountDown';
import Ticket from './pages/Ticket';

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/doacoes' element={<HomePage />} />
        <Route path='/doacoes/doar' element={<DonationPage />} />
        <Route path='/' element={<CountDown unavailable />} />
        <Route path='/bilhetes/comprar' element={<Ticket />} />
        <Route path='/comprar' element={<Ticket />} />
      </Routes>
    </Router>
  );
}

export default App;
