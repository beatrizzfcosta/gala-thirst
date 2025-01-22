import { Container, Button, Row, Col } from 'react-bootstrap';
import React, { useState, useRef, useEffect } from 'react';
import { PlusIcon, MinusIcon } from '@heroicons/react/20/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPerson } from '@fortawesome/free-solid-svg-icons'; // Import the specific solid icon you want to use
import AlertModal from '../modals/AlertModal';
import DonationModal from '../modals/DonationModal';

export default function Contribution({ contribution, setContribution, setInfo }) {
    const [tickets, setTickets] = useState(contribution.tickets);
    const [isSmallWindow, setIsSmallWindow] = useState(window.innerWidth < 400);
    const [maxTickets, setMaxTickets] = useState(false);
    const [amount, setAmount] = useState(0);
    const [total, setTotal] = useState(contribution.tickets * 25);
    const [modalVisible, setModalVisible] = useState(false);
    const [otherContribution, setOtherContribution] = useState(0);
    const [percentage, setPercentage] = useState(0);
    const [otherContributionError, setOtherContributionError] = useState('');
    const [donationModalVisible, setDonationModalVisible] = useState(false);
    const [addLifePage, setAddLifePage] = useState(false);

    const inputRef = useRef(null);

    const changePageDisplay = () => {
        setOtherContribution(0);
        scrollToTop();
        setAmount(0);
        setPercentage(0);
    }

    const handlePlusChange = () => {
        if (tickets < 10) {
            const currentVal = inputRef.current.value === '' ? 0 : parseFloat(inputRef.current.value)
            setTotal(currentVal + (tickets+1)*25);
            setTickets(tickets + 1);
        }
        else setMaxTickets(true);
    };

    const handleMinusChange = () => {
        setMaxTickets(false);
        if (tickets > contribution.tickets) {
            const currentVal = inputRef.current.value === '' ? 0 : parseFloat(inputRef.current.value)
            setTotal(currentVal + (tickets-1)*25);
            setTickets(tickets - 1);
        }
    };

    const validateDonation = () => {
        if (total > 250) {
            setTotal(25 * (tickets-contribution.tickets) + contribution.tickets*25);
            setModalVisible(true);
            inputRef.current.value = '';
            return;
        }
        setContribution(prevContribution => ({...prevContribution, status: 'completed', total: total, futureDonation: false, futureDonationAmount: null}));
        setInfo(prevInfo => ({...prevInfo, status: 'current' }));
    }

    const validateFreeDonation = () => {
        if (amount < 250) setOtherContributionError('O valor mínimo para doação livre é de 250€')
        else { 
            setContribution(prevContribution => ({...prevContribution, status: 'completed', total: amount, futureDonation: false, futureDonationAmount: null}));
            setInfo(prevInfo => ({...prevInfo, status: 'current' }));
        }
    }

    const validateDonationOnGala = (value) => {
        setContribution(prevContribution => ({...prevContribution, status: 'completed', total: amount, futureDonation: true, futureDonationAmount: value}));
        setInfo(prevInfo => ({...prevInfo, status: 'current' }));
    }

    const backFromFreeDonation = () => {
        if (addLifePage) setOtherContribution(0);
        else setOtherContribution(2);
        scrollToTop();
        setAmount(0);
        setPercentage(0);
    }

    const scrollToTop = () => {
        window.scrollTo(0, 0);
    };

    const setOtherContributionAmount = (value) => {
        setOtherContributionError('');
        if (value === '') {
            setAmount(0);
            setPercentage(0);
        }
        else {
            setAmount(value);
            setPercentage(Math.round(value / 12000 * 100));
        }
    }

    const prepareAmount = (value) => {
        if (value === '') setTotal(25 * (tickets-contribution.tickets) + contribution.tickets*25);
        else setTotal(25 * (tickets-contribution.tickets) + contribution.tickets*25 + parseInt(value));
    }

    const handleKeyPress = (event) => {
        if (event.key === 'e') event.preventDefault();
    };

    const generateTicketIcons = () => {
        const ticketIcons = [];
        if (isSmallWindow) {
            for (let row = 0; row < 5; row++) {
                const rowIcons = [];
                for (let col = 0; col < 2; col++) {
                    const index = row * 2 + col;
                    if (index < Math.floor(total/25)) {
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
                    if (index < Math.floor(total/25)) {
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

    useEffect(() => {
        scrollToTop();
        window.addEventListener('resize', updateWindowDimensions);

        return () => {
            window.removeEventListener('resize', updateWindowDimensions);
        };
    }, []);

    return (
        <>
            {otherContribution === 0 && (
                <>
                    <Container className="flex flex-col md:flex-row mx-auto mt-2">
                        <div className="flex-1 p-8">
                            <h3 className="block text-s mb-3 leading-6 text-gray-900">
                                QUANTAS VIDAS PRETENDE ADICIONAR?
                            </h3>
                            <Col className="mt-8 mb-7">
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
                            <h3 className="block text-xs mb-5 leading-6 text-gray-900"  style={{ textAlign: 'center' }}>
                                MAS QUALQUER GOTA CONTA! SE NÃO PRETENDER ADICIONAR O PROPORCIONAL A UMA VIDA, SABIA QUE COM APENAS <strong>1€</strong> PODE DAR ÁGUA A DUAS PESSOAS DURANTE UM ANO?
                            </h3>
                            <div className="relative mt-5 rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="text-[#17CACE] sm:text-sm font-medium">EUR€</span>
                                </div>
                                <input
                                    type="number"
                                    name="price"
                                    id="price"
                                    className="block w-full rounded-sm border-0 py-1.5 pl-14 pr-6 text-[#17CACE] ring-2 ring-inset ring-[#17CACE] placeholder:text-[#17CACE] focus:ring-2 focus:ring-inset focus:ring-[#17CACE] sm:text-sm sm:leading-6"
                                    placeholder="Outro"
                                    min="0"
                                    onKeyPress={handleKeyPress}
                                    ref={inputRef}
                                    onChange={(e) => prepareAmount(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex-1 p-8">
                            <h3 className="block text-xs font-bold leading-6 text-gray-900">
                                Nº VIDAS QUE ESTÁ A SALVAR
                            </h3>
                            <div className="w-full mt-1 mb-5 ring-1 ring-[#17CACE]"/>

                            <div className="mt-5 flex flex-col items-center justify-center">
                                {generateTicketIcons()}
                                <div className="w-full mt-3 ring-1 ring-[#17CACE]"/>

                                <h3 className="block mt-5 text-xs font-bold leading-6 text-gray-900">
                                    RESUMO DA DOAÇÃO
                                </h3>

                                <div className="mt-5 flex flex-col items-center justify-center">
                                    <p className="text-2xl font-bold text-[#17CACE]">
                                        EUR€ {total}
                                    </p>
                                    <p className="mt-4 text-sm font-medium text-gray-900">
                                        EQUIVALE A {Math.floor(total / 25)} VIDAS
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Container>
                    <div className="mt-auto mx-auto flex justify-center">
                        <Button
                            className="rounded-sm mb-5 bg-black px-20 py-2 text-sm font-semibold text-white shadow-md hover:bg-[#17CACE] hover:text-white ring-2 ring-black hover:ring-[#17CACE]"
                            onClick={validateDonation}
                        >
                            CONTINUAR
                        </Button>
                    </div>
                </>
            )}
            {otherContribution === 1 && (
                    <Container className="flex flex-col md:flex-row mx-auto mt-2">
                    <div className="flex-1 p-8">
                        <h3 className="block text-xs font-bold leading-6 text-gray-900">
                            QUAL O MONTANTE QUE QUER DAR PELOS SEUS BILHETES?
                        </h3>
                        <div className="w-full mt-1 mb-5 ring-1 ring-thirst-gray"/>

                        <div className="relative mt-9 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-thirst-blue sm:text-sm font-medium">EUR€</span>
                            </div>
                            <input
                                type="number"
                                name="price"
                                id="price"
                                className="block w-full rounded-sm border-0 py-1.5 pl-14 pr-6 text-gray-900 ring-2 ring-inset ring-thirst-blue placeholder:text-thirst-blue focus:ring-2 focus:ring-inset focus:ring-thirst-blue sm:text-sm sm:leading-6"
                                placeholder="Outro"
                                min="0"
                                onKeyPress={handleKeyPress}
                                onChange={(e) => setOtherContributionAmount(e.target.value)}
                            />
                        </div>
                        {otherContributionError !== '' && (
                            <p className="text-sm text-red-600" id="email-error">
                                {otherContributionError}
                            </p>
                        )}
                        <div className="mt-8 flex flex-col items-center justify-center">
                            <Button
                                className="rounded-sm mt-8 bg-thirst-blue px-10 py-2 text-sm font-semibold text-white shadow-md hover:bg-white/10 hover:text-thirst-blue ring-2 ring-thirst-blue hover:ring-thirst-blue"
                                onClick={backFromFreeDonation}    
                            >
                                VOLTAR
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 p-8">
                        <h3 className="block text-xs font-bold leading-6 text-gray-900">
                            RESUMO DA COMPRA
                        </h3>
                        <div className="w-full mt-1 mb-5 ring-1 ring-thirst-gray"/>

                        <div className="mt-9 flex flex-col items-center justify-center">
                            <p className="text-2xl font-bold text-thirst-blue">
                                EUR€ {amount}
                            </p>
                            <p className="mt-4 text-sm font-medium text-gray-900">
                                EQUIVALE A {percentage}% DE UM FURO
                            </p>
                            <Button
                                className="rounded-sm mt-8 bg-white/10 px-10 py-2 text-sm font-semibold text-thirst-blue shadow-md hover:bg-thirst-blue hover:text-white ring-2 ring-thirst-blue hover:ring-thirst-blue"
                                onClick={validateFreeDonation}    
                            >
                                CONTINUAR
                            </Button>
                        </div>
                    </div>
                </Container>
            )}
            {otherContribution === 2 && (

                <Container className="mx-auto mt-5 flex flex-col items-center justify-center h-center px-10">
                    <p
                        className="mt-5 text-center text-md font-bold text-thirst-dark-grey lg:w-3/4 sm:w-full"
                    >
                        Durante o decorrer da gala, desenrolar-se-á um momento para a realização de doações por parte da plateia presente. Este momento será previamente identificado pelos apresentadores do evento, pelo que estará ao dispor de cada individualidade da plateia a realização de doações de um montante selecionado por cada uma.<br></br>
                        Para que a sua doação seja correntemente realizada deve, no momento que considerar oportuno, levantar a sua mão, para que a doação seja válida. Caso prefira uma doação mais “silenciosa” e discreta, poderá usar a nossa plataforma de doações online, que será disponibilizada durante o dia da gala.<br></br>
                        Para a realização do pagamento da respetiva doação, no final da gala, caso possível, será abordado por um membro do Thirst Project Portugal, para que este o auxilie no pagamento da doação ou ser-lhe-á enviado um email com o todas as instruções, para a realização do pagamento da mesma.
                    </p>
                    <div className="flex mt-2 flex-col sm:flex-row justify-center sm:justify-between sm:px-10">
                        <Button
                            className="rounded-sm w-full mt-8 bg-white/10 px-10 py-2 text-sm font-semibold text-thirst-blue shadow-md hover:bg-thirst-blue hover:text-white ring-2 ring-thirst-blue hover:ring-thirst-blue"
                            onClick={changePageDisplay}    
                        >
                            VOLTAR
                        </Button>
                        <Button
                            className="rounded-sm w-full mt-8 bg-thirst-blue px-20 sm:mx-10 py-2 text-sm font-semibold text-white shadow-md hover:bg-white/10 hover:text-thirst-blue ring-2 ring-thirst-blue hover:ring-thirst-blue"
                            onClick={() => setDonationModalVisible(true)}    
                        >
                            DOAR NA GALA
                        </Button>
                        <Button
                            className="rounded-sm w-full mt-8 bg-white/10 px-10 py-2 text-sm font-semibold text-thirst-blue shadow-md hover:bg-thirst-blue hover:text-white ring-2 ring-thirst-blue hover:ring-thirst-blue"
                            onClick={() => { setOtherContribution(1); scrollToTop(); setAddLifePage(false); }}    
                        >
                            DOAR MAIS AGORA
                        </Button>
                    </div>
                </Container>
            )}
            {modalVisible && (
                <AlertModal setAddLifePage={setAddLifePage} setModalVisible={setModalVisible} setOtherContribution={setOtherContribution} />
            )}
            {donationModalVisible && (
                <DonationModal setDonationModalVisible={setDonationModalVisible} validateDonationOnGala={validateDonationOnGala} />
            )}
        </>
    )
}
