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
        <Route path='/' element={<HomePage />} />
        <Route path='/doacoes/doar' element={<DonationPage />} />
        <Route path='/bilhetes' element={<CountDown unavailable />} />
        <Route path='/bilhetes/comprar' element={<CountDown unavailable />} />
        <Route path='/comprar' element={<Ticket />} />
      </Routes>
    </Router>
  );
}

export default App;
