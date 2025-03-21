import { Container, Button, Row, Col } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { PlusIcon, MinusIcon } from '@heroicons/react/20/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPerson } from '@fortawesome/free-solid-svg-icons'; // Import the specific solid icon you want to use
import "../style/ticket.css"

export default function Ticket({ setTicket, setContribution }) {
    const [tickets, setTickets] = useState(1);
    const [maxTickets, setMaxTickets] = useState(false);
    const [isSmallWindow, setIsSmallWindow] = useState(window.innerWidth < 450);

    const handlePlusChange = () => {
        if (tickets < 10) setTickets(tickets + 1);
        else setMaxTickets(true);
    };

    const handleMinusChange = () => {
        setMaxTickets(false);
        if (tickets > 1) setTickets(tickets - 1);
    };

    const validateDonation = () => {
        setTicket(prevTicket => ({ ...prevTicket, status: 'completed' }));
        setContribution(prevContribution => ({ ...prevContribution, status: 'current', tickets: tickets }));
    }

    const updateWindowDimensions = () => {
        setIsSmallWindow(window.innerWidth < 400);
    };

    const scrollToTop = () => {
        window.scrollTo(0, 0);
    };

    useEffect(() => {
        scrollToTop();
        window.addEventListener('resize', updateWindowDimensions);

        return () => {
            window.removeEventListener('resize', updateWindowDimensions);
        };
    }, []);

    return (
        <Container className="container">
            <div className="row-ticket">
                <h3 className="title-ticket">
                    NÚMERO DE BILHETES
                </h3>
                <div className="line" />
                <h3 className="date-text">
                    22 de Março | 20:00
                </h3>
                <Col className="select-col" >
                    <Row className="select-row">
                        <Button
                            className="button-select"
                            onClick={handleMinusChange}
                        >
                            <MinusIcon className="icon" aria-hidden="true" />
                        </Button>
                        <Button className="qtd">
                            <span className="qtd-text">
                                {tickets}
                            </span>
                        </Button>
                        <Button
                            className="button-select"
                            onClick={handlePlusChange}
                        >
                            <PlusIcon className="icon" aria-hidden="true" />
                        </Button>
                    </Row>
                    {maxTickets && (
                        <p className="error-text" id="email-error">
                            Limite máximo de bilhetes atingido
                        </p>
                    )}
                </Col>
                <div className="text-box">
                    <h3 className="info-text">CADA BILHETE TEM UM PREÇO MÍNIMO DE 85€,</h3>
                    <h3 className="info-text">O EQUIVALENTE A DAR ÁGUA A MAIS DE 3 PESSOAS O RESTO DA SUA VIDA.</h3>
                </div>
                <h3 className="title-ticket">VALOR A PAGAR</h3>
                <div className="line" />
                <p className="amount">
                    EUR€ {tickets * 50}
                </p>
                <h3 className="info-text-2">A SUA PRESENÇA PERMITE SALVAR <span className="vidas">{tickets * 2}</span> VIDAS!</h3>

                <div className="button-box">
                    
                    <Button
                        className="button"
                        onClick={validateDonation}
                    >
                        Continuar
                    </Button>
                </div>
            </div>
           
        </Container>
    )
}
