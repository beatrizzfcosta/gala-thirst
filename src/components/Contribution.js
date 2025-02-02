import { Container, Button, Row, Col } from 'react-bootstrap';
import React, { useState, useRef, useEffect } from 'react';
import { PlusIcon, MinusIcon } from '@heroicons/react/20/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPerson } from '@fortawesome/free-solid-svg-icons'; // Import the specific solid icon you want to use
import AlertModal from '../modals/AlertModal';
import DonationModal from '../modals/DonationModal';
import '../style/contribution.css'

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
            setTotal(currentVal + (tickets + 1) * 25);
            setTickets(tickets + 1);
        }
        else setMaxTickets(true);
    };

    const handleMinusChange = () => {
        setMaxTickets(false);
        if (tickets > contribution.tickets) {
            const currentVal = inputRef.current.value === '' ? 0 : parseFloat(inputRef.current.value)
            setTotal(currentVal + (tickets - 1) * 25);
            setTickets(tickets - 1);
        }
    };

    const validateDonation = () => {
        if (total > 250) {
            setTotal(25 * (tickets - contribution.tickets) + contribution.tickets * 25);
            setModalVisible(true);
            inputRef.current.value = '';
            return;
        }
        setContribution(prevContribution => ({ ...prevContribution, status: 'completed', total: total, futureDonation: false, futureDonationAmount: null }));
        setInfo(prevInfo => ({ ...prevInfo, status: 'current' }));
    }

    const validateFreeDonation = () => {
        if (amount < 250) setOtherContributionError('O valor mínimo para doação livre é de 250€')
        else {
            setContribution(prevContribution => ({ ...prevContribution, status: 'completed', total: amount, futureDonation: false, futureDonationAmount: null }));
            setInfo(prevInfo => ({ ...prevInfo, status: 'current' }));
        }
    }

    const validateDonationOnGala = (value) => {
        setContribution(prevContribution => ({ ...prevContribution, status: 'completed', total: amount, futureDonation: true, futureDonationAmount: value }));
        setInfo(prevInfo => ({ ...prevInfo, status: 'current' }));
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
        if (value === '') setTotal(25 * (tickets - contribution.tickets) + contribution.tickets * 25);
        else setTotal(25 * (tickets - contribution.tickets) + contribution.tickets * 25 + parseInt(value));
    }


    const generateTicketIcons = () => {
        const ticketIcons = [];
        if (isSmallWindow) {
            for (let row = 0; row < 5; row++) {
                const rowIcons = [];
                for (let col = 0; col < 2; col++) {
                    const index = row * 2 + col;
                    if (index < Math.floor(total / 25)) {
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
                    if (index < Math.floor(total / 25)) {
                        rowIcons.push(
                            <FontAwesomeIcon
                                key={index}
                                icon={faPerson}
                                style={{ color: '#17CACE' }}
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
                    <Container className="container">
                        <div className="row-ticket">
                            <h3 className="title-ticket">
                                QUANTAS VIDAS PRETENDE ADICIONAR?
                            </h3>
                            <div className="line" />
                            <Col className="select-col">
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
                            <h3 className="info-text">
                                MAS QUALQUER GOTA CONTA! SE NÃO PRETENDER ADICIONAR O PROPORCIONAL A UMA VIDA, SABIA QUE COM APENAS <strong>1€</strong> PODE DAR ÁGUA A DUAS PESSOAS DURANTE UM ANO?
                            </h3>
                            <div className="container-contribuition">
                                <div className="box-eur">
                                    <span className="eur">EUR€</span>
                                </div>
                                <input
                                    type="number"
                                    name="price"
                                    id="price"
                                    className="input-contribution"
                                    placeholder="Outro"
                                    min="0"
                                    ref={inputRef}
                                    onChange={(e) => prepareAmount(e.target.value)}
                                />
                            </div>
                            <h3 className="title-ticket">
                                RESUMO DA DOAÇÃO
                            </h3>
                            <div className="line" />

                            <div className="box-amount">
                                <p className="contribution-amount">
                                    EUR€ {total}
                                </p>
                            </div>
                        </div>
                        <div className="row-ticket">
                            <h3 className="title-ticket">
                                Nº VIDAS QUE ESTÁ A SALVAR
                            </h3>
                            <div className="line" />

                            <div className="button-box">
                                {generateTicketIcons()}
                                <p className="info-text">
                                    EQUIVALE A {Math.floor(total / 25)} {Math.floor(total / 25) === 1 ? "VIDA" : "VIDAS"}
                                </p>


                                <Button
                                    className="button"
                                    onClick={validateDonation}
                                >
                                    Continuar
                                </Button>

                            </div>
                        </div>
                    </Container>

                </>
            )
            }
            {
                otherContribution === 1 && (
                    <div className="container2">
                        <div className="row-ticket">
                            <h3 className="title-ticket">
                                QUAL O MONTANTE QUE QUER DAR PELOS SEUS BILHETES?
                            </h3>
                            <div className="line" />

                            <div className="container-contribuition2">
                                <div className="box-eur">
                                    <span className="eur">EUR€</span>
                                </div>
                                <input
                                    type="number"
                                    name="price"
                                    id="price"
                                    className="input-contribution"
                                    placeholder="Outro"
                                    min="0"
                                    onChange={(e) => setOtherContributionAmount(e.target.value)}
                                />
                            </div>
                            {otherContributionError !== '' && (
                                <p className="error-text" id="email-error">
                                    {otherContributionError}
                                </p>
                            )}
                            <div className="button-container2">
                                <Button
                                    className="button"
                                    onClick={backFromFreeDonation}
                                >
                                    VOLTAR
                                </Button>
                            </div>
                        </div>
                        <div className="row-ticket">
                            <h3 className="title-ticket">
                                RESUMO DA COMPRA
                            </h3>
                            <div className="line" />

                            <div className="box-amount">
                                <p className="contribution-amount">
                                    EUR€ {amount}
                                </p>
                                <p className="info-text">
                                    EQUIVALE A {percentage}% DE UM FURO
                                </p>
                                <Button
                                    className="button"
                                    onClick={validateFreeDonation}
                                >
                                    CONTINUAR
                                </Button>
                            </div>
                        </div>
                    </div>
                )
            }
            {
                otherContribution === 2 && (

                    <div className="container2">
                        <p
                            className="info-text2"
                        >
                            Durante o decorrer da gala, desenrolar-se-á um momento para a realização de doações por parte da plateia presente. Este momento será previamente identificado pelos apresentadores do evento, pelo que estará ao dispor de cada individualidade da plateia a realização de doações de um montante selecionado por cada uma.<br></br>
                            Para que a sua doação seja correntemente realizada deve, no momento que considerar oportuno, levantar a sua mão, para que a doação seja válida. Caso prefira uma doação mais “silenciosa” e discreta, poderá usar a nossa plataforma de doações online, que será disponibilizada durante o dia da gala.<br></br>
                            Para a realização do pagamento da respetiva doação, no final da gala, caso possível, será abordado por um membro do Thirst Project Portugal, para que este o auxilie no pagamento da doação ou ser-lhe-á enviado um email com o todas as instruções, para a realização do pagamento da mesma.
                        </p>
                        <div className="flex mt-2 flex-col sm:flex-row justify-center sm:justify-between sm:px-10">
                            <Button
                                className="button"
                                onClick={changePageDisplay}
                            >
                                VOLTAR
                            </Button>
                            <Button
                                className="button"
                                onClick={() => setDonationModalVisible(true)}
                            >
                                DOAR NA GALA
                            </Button>
                            <Button
                                className="button"
                                onClick={() => { setOtherContribution(1); scrollToTop(); setAddLifePage(false); }}
                            >
                                DOAR MAIS AGORA
                            </Button>
                        </div>
                    </div>
                )
            }
            {
                modalVisible && (
                    <AlertModal setAddLifePage={setAddLifePage} setModalVisible={setModalVisible} setOtherContribution={setOtherContribution} />
                )
            }
            {
                donationModalVisible && (
                    <DonationModal setDonationModalVisible={setDonationModalVisible} validateDonationOnGala={validateDonationOnGala} />
                )
            }
        </>
    )
}
