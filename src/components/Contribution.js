import { Container, Button, Row, Col } from 'react-bootstrap';
import React, { useState, useRef, useEffect } from 'react';
import { PlusIcon, MinusIcon } from '@heroicons/react/20/solid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPerson } from '@fortawesome/free-solid-svg-icons'; // Import the specific solid icon you want to use
import AlertModal from '../modals/AlertModal';
import DonationModal from '../modals/DonationModal';
import '../style/contribution.css'


export default function Contribution({ contribution, setContribution, setInfo }) {
    const [isSmallWindow, setIsSmallWindow] = useState(window.innerWidth < 400);
    const [maxTickets, setMaxTickets] = useState(false);
    const [amount, setAmount] = useState(0);
    const [total, setTotal] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const [otherContribution, setOtherContribution] = useState(2);
    const [percentage, setPercentage] = useState(0);
    const [otherContributionError, setOtherContributionError] = useState('');
    const [donationModalVisible, setDonationModalVisible] = useState(false);
    const [addLifePage, setAddLifePage] = useState(false);
    const [contributionAmount, setContributionAmount] = useState(0);
  
    const inputRef = useRef(null);

    // const changePageDisplay = () => {
    //     setOtherContribution(0);
    //     scrollToTop();
    //     setAmount(0);
    //     setPercentage(0);
    // }

    const handlePlusChange = () => {
        if (total < 250) {
            setTotal(total + 25);
            setContributionAmount(contributionAmount + 25);
        } else setMaxTickets(true);
    };

    const handleMinusChange = () => {
        setMaxTickets(false);
        if (total > 0) {
            setContributionAmount(contributionAmount - 25);
            setTotal(total - 25);
        }
    };


    const validateDonation = () => {
        if (total > 250) {
            setTotal(50 * (contribution.tickets) + total);
            setModalVisible(true);
            inputRef.current.value = '';
            return;
        }
        setContribution(prevContribution => ({ 
            ...prevContribution, 
            status: 'completed', 
            total: total,  // Removendo a soma com contribution.tickets * 50
            futureDonation: false, 
            futureDonationAmount: null 
        }));
        setInfo(prevInfo => ({ ...prevInfo, status: 'current' }));
    }

    const validateFreeDonation = () => {
        if (amount < 250) {
            setOtherContributionError(`O valor mínimo para doação livre é de 250€`);
        } else {
            setContribution(prevContribution => ({
                ...prevContribution,
                status: 'completed',
                total: amount, // Define amount como o único valor total
                futureDonation: false,
                futureDonationAmount: null
            }));
            setInfo(prevInfo => ({ ...prevInfo, status: 'current' }));
        }
    };
    

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
    
        const newAmount = value ? parseInt(value, 10) : 0;
        
        setAmount(newAmount); // Define o valor do amount
        setTotal(newAmount); // Agora, total reflete apenas amount
        
        setPercentage(Math.round(newAmount / 12000 * 100));
    };
    

    // const prepareAmount = (value) => {
    //     if (value === '') setTotal(85 * (tickets - contribution.tickets) + contribution.tickets * 85);
    //     else setTotal(85 * (tickets - contribution.tickets) + contribution.tickets * 85 + parseInt(value));
    // }


    const generateTicketIcons = () => {
        const ticketIcons = [];
        if (isSmallWindow) {
            for (let row = 0; row < 5; row++) {
                const rowIcons = [];
                for (let col = 0; col < 4; col++) {
                    const index = row * 4 + col;
                    if (index < Math.floor(total / 25)) {
                        rowIcons.push(
                            <FontAwesomeIcon
                                key={index}
                                icon={faPerson}
                                style={{ color: '#1bb7c5' }}
                                size="5x"
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
                    <div key={row} className="flex mt-2 justify-between">
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
                    <div key={row} className="flex mt-2 md:justify-between">
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
                                ALÉM DO/S SEU/S BILHETE/S, QUANTAS VIDAS A MAIS QUER SALVAR?
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
                                            {Math.floor(total / 25)}
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
                                É POSSÍVEL PERSONALIZAR O MONTANTE A DOAR, CADA GOTA CONTA! 1€ DÁ ÁGUA POTÁVEL A DUAS PESSOAS POR UM ANO.
                            </h3>
                            <div className="container-contribuition">
                                <div className="box-eur">
                                    <span className="eur">EUR€</span>
                                </div>
                                <input
                                    type="number"
                                    name="price"
                                    id="price"
                                    className="input-contribution-other"
                                    placeholder="Outro"
                                    min="0"
                                    ref={inputRef}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setContributionAmount(value ? parseInt(value) : 0);
                                        setTotal(value ? parseInt(value) : 0);
                                    }}
                                />
                            </div>
                            <h3 className="title-ticket">
                                RESUMO DA COMPRA
                            </h3>
                            <div className="line" />

                            <table className="summary-table">
                                <thead>
                                    <tr>
                                        <th>QTD</th>
                                        <th>Item</th>
                                        <th>Valor Unitário</th>
                                        <th>Valor Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="info-text">{contribution.tickets}</td>
                                        <td className="info-text">Bilhete</td>
                                        <td className="info-text">EUR€ 50</td>
                                        <td className="info-text">EUR€ {contribution.tickets * 50}</td>
                                    </tr>
                                    {total > 0 && (
                                        <tr>
                                            <td className="info-text">1</td>
                                            <td className="info-text">Contribuição</td>
                                            <td className="info-text">-</td>
                                            <td className="info-text">EUR€ {contributionAmount}</td>
                                        </tr>
                                    )}
                                    <tr className="line-row">
                                            <td colSpan="4">
                                                <hr className="summary-divider" />
                                            </td>
                                        </tr>
                                    <tr>
                                        <td className="info-text"></td>
                                        <td className="info-text"></td>
                                        <td className="info-text"></td>
                                        <td className="total-amount">EUR€ {otherContribution === 1 ? amount : contribution.tickets * 50 + contributionAmount}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>


                        <div className="row-ticket">
                            <div className="button-box">
                                {generateTicketIcons()}
                                <p className="info-text">
                                    EQUIVALE A MAIS {Math.floor(total / 25)} {Math.floor(total / 25) === 1 ? "VIDA SALVADA PELO/S SEU/S BILHETE/S" : "VIDAS SALVAS PELO/S SEU/S BILHETE/S"}
                                </p>
                            </div>
                            <Button
                                className="button"
                                onClick={validateDonation}
                            >
                                Continuar
                            </Button>


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
                                QUAL O MONTANTE QUE QUER DOAR?
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
                                    placeholder="250"
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
                            A Gala Thirst Project Portugal terá um momento de doações ao vivo, onde os convidados terão oportunidade de contribuir para a missão da Organização.
                        </p>
                        <p className="info-text2">
                            Existe, também, a possibilidade de contribuir previamente, atribuindo um montante adicional ao seu bilhete.
                        </p>
                        <p className="info-text2">
                            DAR ÁGUA É DAR VIDA
                        </p>
                        <div className="container-buttons-contribution">
                            <Button
                                className="button"
                                onClick={() => validateDonationOnGala(0)}
                            >
                                DOAR NA GALA
                            </Button>
                            <Button
                                className="button"
                                onClick={() => { setOtherContribution(0); scrollToTop(); setAddLifePage(false); }}
                            >
                                DOAR AGORA
                            </Button>
                        </div>
                    </div>
                )
            }
            {
                modalVisible && (
                    <AlertModal setAddLifePage={setAddLifePage} setModalVisible={setModalVisible} setOtherContribution={setOtherContribution} tickets={contribution.tickets}   />
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
