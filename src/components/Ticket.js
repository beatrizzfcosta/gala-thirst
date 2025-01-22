import { Container, Button, Row, Col } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { PlusIcon, MinusIcon } from '@heroicons/react/20/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPerson } from '@fortawesome/free-solid-svg-icons'; // Import the specific solid icon you want to use

export default function Ticket({ setTicket, setContribution }) {
    const [tickets, setTickets] = useState(1);
    const [maxTickets, setMaxTickets] = useState(false);
    const [isSmallWindow, setIsSmallWindow] = useState(window.innerWidth < 400);

    const handlePlusChange = () => {
        if (tickets < 10) setTickets(tickets + 1);
        else setMaxTickets(true);
    };

    const handleMinusChange = () => {
        setMaxTickets(false);
        if (tickets > 1) setTickets(tickets - 1);
    };

    const validateDonation = () => {
        setTicket(prevTicket => ({...prevTicket, status: 'completed'}));
        setContribution(prevContribution => ({...prevContribution, status: 'current', tickets: tickets}));
    }

    const generateTicketIcons = () => {
        const ticketIcons = [];
    
        if (isSmallWindow) {
            for (let row = 0; row < 5; row++) {
                const rowIcons = [];
                for (let col = 0; col < 2; col++) {
                    const index = row * 2 + col;
                    if (index < tickets) {
                        rowIcons.push(
                            <FontAwesomeIcon
                                key={index}
                                icon={faPerson}
                                style={{ color: '#1bb7c5' }}
                                size="6x"
                                className='me-2 mb-5'
                            />
                        );
                    } else {
                        rowIcons.push(
                            <FontAwesomeIcon
                                key={index}
                                icon={faPerson}
                                style={{ color: '#c9c9c9' }}
                                size="6x"
                                className='me-2 mb-5'
                            />
                        );
                    }
                }
                ticketIcons.push(
                    <div key={row} className="flex mt-2 justify-between flex-wrap">
                        {rowIcons}
                    </div>
                );
            }
        } else {
            for (let row = 0; row < 2; row++) {
                const rowIcons = [];
                for (let col = 0; col < 5; col++) {
                    const index = row * 5 + col;
                    if (index < tickets) {
                        rowIcons.push(
                            <FontAwesomeIcon
                                key={index}
                                icon={faPerson}
                                style={{ color: '#1bb7c5' }}
                                size="6x"
                                className='me-2 mb-5'
                            />
                        );
                    } else {
                        rowIcons.push(
                            <FontAwesomeIcon
                                key={index}
                                icon={faPerson}
                                style={{ color: '#c9c9c9' }}
                                size="6x"
                                className='me-2 mb-5'
                            />
                        );
                    }
                }
                ticketIcons.push(
                    <div key={row} className="flex mt-2 md:justify-between flex-wrap">
                        {rowIcons}
                    </div>
                );
            }
        }
    
        return ticketIcons;
    }; 
    
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
        <Container className="flex flex-col md:flex-row mx-auto mt-2">
            <div className="flex-1 p-8">
                <h3 className="block text-xs font-bold leading-6 text-gray-900">
                    NÚMERO DE BILHETES
                </h3>
                <div className="w-full mt-1 ring-1 ring-[#17CACE]"/>
                <h3 className="block mt-4 text-md font-bold text-[#17CACE]" style={{ textAlign: 'center' }}>
                    22 de Março | 20:00
                </h3>
                <Col className="mt-4 mb-4" >
                    <Row style={{ display: 'flex', alignItems: 'center', justifyContent:'center' }}>
                        <Button
                            className="rounded-md bg-[#c8f3f4] p-1 me-3 text-black shadow-md hover:bg-[#17CACE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={handleMinusChange}
                        >
                            <MinusIcon className="h-5 w-5" aria-hidden="true" />
                        </Button>
                        <Button className="rounded-md bg-[#17CACE] px-10 py-1 me-3 text-white shadow-md" style={{ display: 'flex', alignItems: 'center' }}>
                            <span className="text-black" style={{ fontSize: '13px' }}>
                                {tickets}
                            </span>
                        </Button>
                        <Button
                            className="rounded-md bg-[#c8f3f4] p-1 text-black shadow-md hover:bg-[#17CACE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            onClick={handlePlusChange}
                        >
                            <PlusIcon className="h-5 w-5" aria-hidden="true" />
                        </Button>
                    </Row>
                    {maxTickets && (
                        <p className="text-sm mt-2 text-red-600" id="email-error" style={{ textAlign: 'center' }}>
                            Limite máximo de bilhetes atingido
                        </p>
                    )}
                </Col>
                <h3 className="block text-xs mb-3 leading-6 text-gray-900" style={{ textAlign: 'center' }}>
                    CADA BILHETE TEM UM PREÇO MÍNIMO DE 25€,
                </h3>
                <h3 className="block text-xs mb-5 leading-6 text-gray-900" style={{ textAlign: 'center' }}>
                    O EQUIVALENTE A DAR ÁGUA A UMA PESSOA PARA O RESTO DA SUA VIDA.
                </h3>

                <h3 className="block text-xs font-bold leading-6 text-gray-900">
                    VALOR A PAGAR
                </h3>
                <div className="w-full mt-1 mb-5 ring-1 ring-[#17CACE]"/>

                <p className="text-2xl ml-2 font-bold"  style={{ textAlign: 'center' }}>
                    EUR€ {tickets * 25}
                </p>
            </div>
            <div className="flex-1 p-8">
                <h3 className="block text-xs font-bold leading-6 text-gray-900">
                    Nº VIDAS QUE ESTÁ A SALVAR
                </h3>
                <div className="w-full mt-1 mb-5 ring-1 ring-[#17CACE]"/>

                <div className="mt-5 flex flex-col items-center justify-center">
                    {generateTicketIcons()}
                    <Button
                        className="rounded-sm mt-8 bg-black px-10 py-2 text-sm font-semibold text-white shadow-md hover:bg-[#17CACE] hover:text-white ring-2 ring-black hover:ring-[#17CACE]"
                        onClick={validateDonation}    
                    >
                        Continuar
                    </Button>
                </div>
            </div>
        </Container>
    )
}
