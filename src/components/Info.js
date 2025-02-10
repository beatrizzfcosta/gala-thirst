import { Container, Button, Image } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import TermsModal from '../modals/TermsModal';
import { addTicketBuyer, getTicketById, checkPromoCode } from '../firebase/firebase';
import mbway from '../assets/mbway.png';
import multibanco from '../assets/multibanco.png';
import MultibancoModel from '../modals/MultibancoModel';
import MbwayModel from '../modals/MbwayModel';
import '../style/info.css';

export default function Info({ setInfo, setSummary, contribution }) {
    const [emailError, setEmailError] = useState(false);
    const [names, setNames] = useState([]);
    const [email, setEmail] = useState('');
    const [nif, setNif] = useState({ nif: '', name: '', address: '' });
    const [isNif, setIsNif] = useState(false);
    const [nifError, setNifError] = useState({ nif: false, name: false, address: false });
    const [checkboxChecked, setCheckboxChecked] = useState(false);
    const [namesError, setNamesError] = useState(false);
    const [futureContact, setFutureContact] = useState(false);
    const [termsVisible, setTermsVisible] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [termsError, setTermsError] = useState(false);
    const [paymentType, setPaymentType] = useState('none');
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState(false);
    const [mbInfo, setMBInfo] = useState(null);
    const [blockButton, setBlockButton] = useState(false);
    const [internalError, setInternalError] = useState(false);
    const [mbModalVisible, setMBModalVisible] = useState(false);
    const [mbwayModalVisible, setMBwayModalVisible] = useState(false);
    const [paymentTypeError, setPaymentTypeError] = useState(false);
    const [total, setTotal] = useState(contribution.total - contribution.tickets * 85);

    // Adicione um estado para o código promocional
    const [promoCode, setPromoCode] = useState('');
    const [discountedPrice, setDiscountedPrice] = useState(contribution.total || 85);
    const [updatedTickets, setUpdatedTickets] = useState(contribution.tickets);
    const [promoApplied, setPromoApplied] = useState(false);
    const [promoDetails, setPromoDetails] = useState({});

    // Função para lidar com a verificação do código promocional
    const handlePromoCodeChange = async (event) => {
        const code = event.target.value;
        setPromoCode(code);

    };

    const applyPromoCode = () => {
        if (promoCode === 'TOTAL') {
            setDiscountedPrice(0);
            if (updatedTickets > 0) {
                setPromoDetails({ originalPrice: 85, discountedPrice: 0 });
                setUpdatedTickets(updatedTickets - 1);
                setPromoApplied(true);
            }
        } else if (promoCode === 'PARCIAL') {
            setDiscountedPrice(35);
            if (updatedTickets > 0) {
                setPromoDetails({ originalPrice: 85, discountedPrice: 35 });
                setUpdatedTickets(updatedTickets - 1);
                setPromoApplied(true);
            }
        } else {
            setDiscountedPrice(contribution.total || contribution.tickets * 85);
            setPromoApplied(false);
        }
    };

    useEffect(() => {
        // Aplicar o código promocional automaticamente ao alterar o código
        applyPromoCode();
    }, [promoCode]);

    const changeFromMultibanco = () => {
        setInfo(prevInfo => ({ ...prevInfo, status: 'completed' }));
        setSummary(prevSummary => ({ ...prevSummary, status: 'current' }));
    };

    const renderInputBoxes = () => {
        const inputBoxes = [];
        for (let i = 1; i < contribution.tickets; i++) {
            inputBoxes.push(
                <div key={i} className="container-contribution">
                    <input
                        type="text"
                        name={`ticket-${i}`}
                        id={`ticket-${i}`}
                        className="input-contribution2"
                        placeholder={`Nome do bilhete ${i + 1}`}
                        value={names[i] || ''}
                        onChange={(e) => handleNameChange(i, e.target.value)}
                    />
                </div>
            );
        }
        return inputBoxes;
    };

    const handleNameChange = (index, value) => {
        if (namesError) setNamesError(false);
        let updatedNames = [...names];
        updatedNames[index] = value;
        setNames(updatedNames);
    };

    const validateDonation = async () => {
        setBlockButton(true);
        setInternalError(false);
        if (!termsAccepted) {
            setTermsError(true);
            setBlockButton(false);
        }
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const validEmail = emailRegex.test(email);
        setEmailError(!validEmail);
        if (!validEmail) setBlockButton(false);

        if (paymentType === 'mbway') {
            if (phone.length !== 9 || !/^\d+$/.test(phone)) {
                setPhoneError(true);
                setBlockButton(false);
            }
        }
        if (isNif) {
            if (nif.nif.length !== 9 || !/^\d+$/.test(nif.nif)) {
                setNifError((prevNif) => ({ ...prevNif, nif: true }));
                setBlockButton(false);
            }
            if (nif.name.trim() === '') {
                setNifError((prevName) => ({ ...prevName, name: true }));
                setBlockButton(false);
            }
            if (nif.address.trim() === '') {
                setNifError((prevAddress) => ({ ...prevAddress, address: true }));
                setBlockButton(false);
            }
        }
        if (paymentType === 'none') {
            setBlockButton(false);
            setPaymentTypeError(true);
        }
        if ((names.length !== contribution.tickets && checkboxChecked) || names.some((name) => name.trim() === '') || names.length === 0) {
            setNamesError(true);
            setBlockButton(false);
        }
        if (!phoneError && termsAccepted && validEmail && !nifError.nif && !nifError.name && !nifError.address && !namesError && paymentType !== 'none') {
            const info = {
                names: names,
                tickets: contribution.tickets,
                total: contribution.total ? contribution.total : contribution.tickets * 25,
                nif: nif,
                email: email,
                phone: phone,
                futureContact: futureContact,
                termsAccepted: termsAccepted,
                futureDonation: contribution.futureDonation,
                futureDonationAmount: contribution.futureDonationAmount,
                paid: false,
                referenceCreated: false,
                error: false,
                type: paymentType,
                referencia: null,
                entidade: null,
            };
            const result = await addTicketBuyer(info);
            if (paymentType === 'mbway') {
                setTimeout(async () => {
                    if (result !== false) {
                        let ticketUpdated = await getTicketById(result);
                        if (ticketUpdated !== null && ticketUpdated.referenceCreated) {
                            setBlockButton(false);
                            setMBwayModalVisible(true);
                            return;
                        } else {
                            setTimeout(async () => {
                                ticketUpdated = await getTicketById(result);
                                if (ticketUpdated !== null && ticketUpdated.referenceCreated) {
                                    setBlockButton(false);
                                    setMBwayModalVisible(true);
                                    return;
                                }
                                if (ticketUpdated !== null && ticketUpdated.error !== false) {
                                    setInternalError(true);
                                    setBlockButton(false);
                                    return;
                                }
                            }, 7000)
                        }
                        if (ticketUpdated !== null && ticketUpdated.error !== false) {
                            setInternalError(true);
                            setBlockButton(false);
                            return;
                        }
                    }
                }, 7000);
            } else if (paymentType === 'multibanco') {
                setTimeout(async () => {
                    if (result !== false) {
                        let ticketUpdated = await getTicketById(result);
                        if (ticketUpdated !== null && ticketUpdated.referenceCreated) {
                            setBlockButton(false);
                            setMBInfo({
                                entidade: ticketUpdated.entidade,
                                referencia: ticketUpdated.referencia,
                                valor: ticketUpdated.total,
                            })
                            setMBModalVisible(true);
                            return;
                        } else {
                            setTimeout(async () => {
                                ticketUpdated = await getTicketById(result);
                                if (ticketUpdated !== null && ticketUpdated.referenceCreated) {
                                    setBlockButton(false);
                                    setMBInfo({
                                        entidade: ticketUpdated.entidade,
                                        referencia: ticketUpdated.referencia,
                                        valor: ticketUpdated.total,
                                    })
                                    setMBModalVisible(true);
                                    return;
                                }
                                if (ticketUpdated !== null && ticketUpdated.error !== false) {
                                    setInternalError(true);
                                    setBlockButton(false);
                                    return;
                                }
                            }, 5000)
                        }
                        if (ticketUpdated !== null && ticketUpdated.error !== false) {
                            setInternalError(true);
                            setBlockButton(false);
                            return;
                        }
                    }
                }, 10000);
            }
        }
    }

    const handleContactChange = () => {
        setFutureContact(!futureContact);
    }

    const handleNifChange = () => {
        setIsNif(!isNif);
        setNif({ nif: '', name: '', address: '' });
        setNifError({ nif: false, name: false, address: false });
    }

    const handleTermsChange = () => {
        setTermsVisible(!termsVisible);
    }

    const handleKeyPress = (event) => {
        if (event.key === 'e') {
            event.preventDefault();
        }
    };

    const scrollToTop = () => {
        window.scrollTo(0, 0);
    };

    useEffect(() => {
        scrollToTop();
    }, []);

    return (
        <Container className="container">
            <div className="row-ticket">
                <h3 className="title-ticket">
                    COMPLETE COM A SUA INFORMAÇÃO
                </h3>
                <div className="line" />
                <div>
                    <div className="container-contribuition">
                        <input
                            type="text"
                            name="name"
                            id="name"
                            className="input-contribution2"
                            placeholder="Nome"
                            aria-describedby="name"
                            value={names[0]}
                            onChange={(e) => handleNameChange(0, e.target.value)}
                        />
                    </div>
                    {contribution.tickets > 1 && (
                        <div className="container-checkbox">
                            <div className="container-checkbox-part">
                                <input
                                    id="hide-name"
                                    aria-describedby="name"
                                    name="name"
                                    type="checkbox"
                                    className="checkbox"
                                    style={{ boxShadow: 'none' }}
                                    onChange={() => { setCheckboxChecked(!checkboxChecked); if (!checkboxChecked) setNames([names[0]]); }}
                                />
                            </div>
                            <div className="container-checkbox-part">
                                <label htmlFor="comments" className="select-text">
                                    ATRIBUIR NOMES INDIVIDUAIS A CADA BILHETE
                                </label>
                            </div>
                        </div>
                    )}
                    {checkboxChecked && renderInputBoxes()}
                    {namesError && (
                        <p className="error-text" id="email-error">
                            Preencha todos os campos
                        </p>
                    )}
                </div>
                <div>
                    <div className="container-contribuition">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="input-contribution2"
                            placeholder="Email"
                            aria-invalid="true"
                            aria-describedby="email-error"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(false); }}
                        />
                        {emailError && (
                            <div className="error-container">
                                <ExclamationCircleIcon className="error-icon" aria-hidden="true" />
                            </div>
                        )}
                    </div>
                    {emailError && (
                        <p className="error-text" id="email-error">
                            Endereço de email inválido
                        </p>
                    )}
                    <div className="container-checkbox">
                        <div className="container-checkbox-part">
                            <input
                                id="email"
                                aria-describedby="email"
                                name="email"
                                type="checkbox"
                                className="checkbox"
                                style={{ boxShadow: 'none' }}
                                onChange={handleContactChange}
                            />
                        </div>
                        <div className="container-checkbox-part">
                            <label htmlFor="email" className="select-text">
                                GOSTARIA DE SER CONTACTADO NO FUTURO
                            </label>
                        </div>
                    </div>

                    <h3 className="title-ticket">
                        VALOR A PAGAR
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
                    {updatedTickets > 0 && (
                        <tr>
                            <td className="info-text">{updatedTickets}</td>
                            <td className="info-text">Ticket</td>
                            <td className="info-text">EUR€ 85</td>
                            <td className="info-text">EUR€ {updatedTickets * 85}</td>
                        </tr>
                    )}
                    {promoApplied && (
                        <tr>
                            <td className="info-text">1</td>
                            <td className="info-text">PROMO</td>
                            <td className="info-text">
                                <s style={{ color: 'red' }}>EUR€ {promoDetails.originalPrice}</s> EUR€ {promoDetails.discountedPrice}
                            </td>
                            <td className="info-text">EUR€ {promoDetails.discountedPrice}</td>
                        </tr>
                    )}
                    {contribution.total > 0 && (
                        <tr>
                            <td className="info-text">1</td>
                            <td className="info-text">Contribuição</td>
                            <td className="info-text">-</td>
                            <td className="info-text">EUR€ {contribution.total}</td>
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
                        <td className="total-amount">EUR€ {(updatedTickets * 85) + (promoApplied ? promoDetails.discountedPrice : 0) + contribution.total}</td>
                    </tr>
                </tbody>
            </table>
                </div>
                <h3 className="title-ticket">INSIRA O SEU CÓDIGO PROMOCIONAL</h3>
                <div className="container-contribution">
                    <input
                        type="text"
                        name="promoCode"
                        id="promoCode"
                        className="input-contribution2"
                        placeholder="Código promocional"
                        value={promoCode}
                        onChange={handlePromoCodeChange}
                    />
                    <Button className="button" onClick={applyPromoCode}>
                        Aplicar Código
                    </Button>
                </div>
            </div>
            <div className="row-ticket">
                <h3 className="title-ticket">
                    PAGAMENTO - SELECIONE O MÉTODO
                </h3>
                <div className="line" />
                <div className="payment-methods-container">
                    <div className="payment-methods">
                        <Button
                            className={`flex items-center ${paymentType === 'multibanco' ? 'bg-[#17CACE]' : 'bg-white/10'} me-3 rounded-lg p-1`}
                            onClick={() => { setPaymentType('multibanco'); if (paymentTypeError) setPaymentTypeError(false); }}
                        >
                            <Image src={multibanco} alt="multibanco" width={40} height={40} />
                        </Button>
                        <Button
                            className={`flex items-center ${paymentType === 'mbway' ? 'bg-[#17CACE]' : 'bg-white/10'} me-3 rounded-lg p-1`}
                            onClick={() => { setPaymentType('mbway'); if (paymentTypeError) setPaymentTypeError(false); }}
                        >
                            <Image src={mbway} alt="mbway" width={40} height={40} />
                        </Button>
                    </div>
                    {paymentTypeError && (
                        <p className="error-text" id="name-error">
                            Por favor selecione um método de pagamento
                        </p>
                    )}
                </div>
                {mbModalVisible && (
                    <MultibancoModel setMBModalVisible={setMBModalVisible} mbInfo={mbInfo} changeFromMultibanco={changeFromMultibanco} />
                )}
                {mbwayModalVisible && (
                    <MbwayModel setMBwayModalVisible={setMBwayModalVisible} changeFromMultibanco={changeFromMultibanco} />
                )}
                {paymentType === 'mbway' && (
                    <>
                        <div className="container-contribuition">
                            <input
                                type="number"
                                name="phone"
                                id="dedication"
                                className="input-contribution2"
                                placeholder="Número de telefone (sem indicativo)"
                                aria-describedby="phone"
                                value={phone}
                                onKeyPress={handleKeyPress}
                                onChange={(e) => { setPhone(e.target.value); if (phoneError) setPhoneError(false); }}
                            />
                            {phoneError && (
                                <div className="error-container">
                                    <ExclamationCircleIcon className="error-icon" aria-hidden="true" />
                                </div>
                            )}
                        </div>
                        {phoneError && (
                            <p className="error-text" id="name-error">
                                Número inválido (caso tenha introduzido indicativo, retire-o)
                            </p>
                        )}
                    </>
                )}
                <div className="container-checkbox">
                    <div className="container-checkbox-part">
                        <input
                            id="nif"
                            aria-describedby="nif"
                            name="nif"
                            type="checkbox"
                            className="checkbox"
                            style={{ boxShadow: 'none' }}
                            onChange={handleNifChange}
                        />
                    </div>
                    <div className="container-checkbox-part">
                        <label htmlFor="email" className="select-text">
                            DESEJO EMITIR FATURA
                        </label>
                    </div>
                </div>
                {isNif && (
                    <>
                        <div className="container-contribuition">
                            <input
                                type="text"
                                name="name"
                                id="dedication"
                                className="input-contribution2"
                                placeholder="Nome de emissão da fatura"
                                aria-describedby="name"
                                value={nif.name}
                                onChange={(e) => { setNif(prevName => ({ ...prevName, name: e.target.value })); if (nifError.address) setNifError(prevName => ({ ...prevName, name: false })); }}
                            />
                            {nifError.name && (
                                <div className="error-container">
                                    <ExclamationCircleIcon className="error-icon" aria-hidden="true" />
                                </div>
                            )}
                        </div>
                        {nifError.name && (
                            <p className="error-text" id="name-error">
                                Nome inválido
                            </p>
                        )}
                        <div className="container-contribuition">
                            <input
                                type="number"
                                name="nif"
                                id="dedication"
                                className="input-contribution2"
                                placeholder="NIF"
                                aria-describedby="nif"
                                value={nif.nif}
                                onKeyPress={handleKeyPress}
                                onChange={(e) => { setNif(prevNif => ({ ...prevNif, nif: e.target.value })); if (nifError.nif) setNifError(prevNif => ({ ...prevNif, nif: false })); }}
                            />
                            {nifError.nif && (
                                <div className="error-container">
                                    <ExclamationCircleIcon className="error-icon" aria-hidden="true" />
                                </div>
                            )}
                        </div>
                        {nifError.nif && (
                            <p className="error-text" id="nif-error">
                                NIF inválido
                            </p>
                        )}
                        <div className="container-contribuition">
                            <input
                                type="text"
                                name="address"
                                id="dedication"
                                className="input-contribution2"
                                placeholder="Morada"
                                aria-describedby="address"
                                value={nif.address}
                                onChange={(e) => { setNif(prevAddress => ({ ...prevAddress, address: e.target.value })); if (nifError.address) setNifError(prevAddress => ({ ...prevAddress, address: false })); }}
                            />
                            {nifError.address && (
                                <div className="error-container">
                                    <ExclamationCircleIcon className="error-icon" aria-hidden="true" />
                                </div>
                            )}
                        </div>
                        {nifError.address && (
                            <p className="error-text" id="address-error">
                                Morada inválida
                            </p>
                        )}
                    </>
                )}

                <div className="container-checkbox-term">
                    <div className="container-checkbox-part">
                        <input
                            id="nif"
                            aria-describedby="nif"
                            name="nif"
                            type="checkbox"
                            className="checkbox"
                            style={{ boxShadow: 'none' }}
                            onChange={handleTermsChange}
                        />
                    </div>
                    <div className="container-checkbox-part">
                        <label htmlFor="email" className="select-text">
                            ACEITO OS TERMOS E CONDIÇÕES DA GALA DO THIRST PROJECT PORTUGAL
                        </label>
                        {termsError && (
                            <p className="error-text" id="address-error">
                                Aceite os termos e condições
                            </p>
                        )}
                    </div>
                </div>

                <div className="button-box">
                    <Button
                        className="button"
                        onClick={validateDonation}
                        disabled={blockButton}
                    >
                        {blockButton ? (
                            <div className="loader"></div>
                        ) : (
                            'CONTINUAR'
                        )}
                    </Button>
                    {internalError && (
                        <p className="text-error" id="address-error">
                            Ocorreu um erro interno. Por favor, tente novamente. Se o erro persistir por favor contacte-nos através do email gala@thirstproject.pt
                        </p>
                    )}
                </div>
            </div>
            {termsVisible && (
                <TermsModal setTermsVisible={setTermsVisible} setTermsAccepted={setTermsAccepted} setTermsError={setTermsError} />
            )}
        </Container>
    )
}
