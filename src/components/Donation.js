import { Container, Button } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { addDonation } from '../firebase/firebase';
import '../style/donation.css'

export default function Donation({ setDonation, setPayment }) {
    const [emailError, setEmailError] = useState(false);
    const [isNameHidden, setIsNameHidden] = useState(false);
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState(false);
    const [email, setEmail] = useState('');
    const [comment, setComment] = useState('');
    const [amount, setAmount] = useState('Outro');
    const [amountError, setAmountError] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const [dedication, setDedication] = useState('');
    const [isDedication, setIsDedication] = useState(false);
    const [dedicationError, setDedicationError] = useState(false);
    const [nif, setNif] = useState({ nif: '', name: '', address: '' });
    const [isNif, setIsNif] = useState(false);
    const [nifError, setNifError] = useState({ nif: false, name: false, address: false });
    const [futureContact, setFutureContact] = useState(false);
    const [donationError, setDonationError] = useState(false);
    const [blockButton, setBlockButton] = useState(false);

    const handleKeyPress = (event) => {
        if (event.key === 'e') {
            event.preventDefault();
        }
    };

    const handleCheckboxChange = () => {
        setIsNameHidden(!isNameHidden);
        setName('');
        setNameError(false);
    };

    const prepareAmount = (amount) => {
        if (amountError) setAmountError(false);
        setAmount(parseFloat(amount));
        amount ? setPercentage(Math.round(parseFloat(amount) / 12000 * 100)) : setPercentage(0);
    }

    const validateDonation = async () => {
        setBlockButton(true);
        if (donationError) setDonationError(false);
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const validEmail = emailRegex.test(email);
        setEmailError(!validEmail);
        if (!validEmail) setBlockButton(false);

        if (isNif) {
            if (nif.nif.length !== 9 || !/^\d+$/.test(nif.nif)) {
                setNifError(prevNif => ({ ...prevNif, nif: true }));
                setBlockButton(false);
            }
            if (nif.name.trim() === '') {
                setNifError(prevName => ({ ...prevName, name: true }));
                setBlockButton(false);
            }
            if (nif.address.trim() === '') {
                setNifError(prevAddress => ({ ...prevAddress, address: true }));
                setBlockButton(false);
            }
        }
        if (!isNameHidden && name.trim() === '') {
            setNameError(true);
            setBlockButton(false);
        }
        if (isDedication && dedication.trim() === '') {
            setDedicationError(true);
            setBlockButton(false);
        }
        if (amount === 0 || amount === '' || amount === 'Outro') {
            setAmountError(true);
            setBlockButton(false);
            return;
        }
        if (!dedicationError && !nameError && !amountError && validEmail && !nifError.nif && !nifError.name && !nifError.address) {
            const info = {
                name: name,
                total: amount,
                nif: nif,
                email: email,
                futureContact: futureContact,
                comment: comment,
                dedication: dedication,
                paid: false,
                referenceCreated: false,
                error: false,
                type: 'none',
                referencia: null,
                entidade: null,
            }

            setDonation(prevDonation => ({ ...prevDonation, status: 'completed' }));
            setPayment(prevPayment => ({ ...prevPayment, status: 'current', info: info }));

            setBlockButton(false);

        }
    }

    const handleDedicationsChange = () => {
        setIsDedication(!isDedication);
        setDedication('');
        setDedicationError(false);
    }

    const handleContactChange = () => {
        setFutureContact(!futureContact);
    }

    const handleNifChange = () => {
        setIsNif(!isNif);
        setNif({ nif: '', name: '', address: '' });
        setNifError({ nif: false, name: false, address: false });
    }

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
                    <div className="relative mt-5 rounded-md shadow-sm">
                        <input
                            type="text"
                            name="name"
                            id="name"
                            className="input-contribution2"
                            placeholder="Nome"
                            aria-describedby="name"
                            disabled={isNameHidden}
                            value={name}
                            onChange={(e) => { setName(e.target.value); if (nameError) setNameError(false); }}
                        />
                        {nameError && (
                            <div className="error-container">
                                <ExclamationCircleIcon className="error-icon" aria-hidden="true" />
                            </div>
                        )}
                    </div>
                    {nameError && (
                        <p className="error-text" id="email-error">
                            Nome inválido
                        </p>
                    )}
                    <div className="container-checkbox">
                        <div className="container-checkbox-part">
                            <input
                                id="hide-name"
                                aria-describedby="name"
                                name="name"
                                type="checkbox"
                                className="checkbox"
                                style={{ boxShadow: 'none' }}
                                onChange={handleCheckboxChange}
                            />
                        </div>
                        <div className="container-checkbox-part">
                            <label htmlFor="comments" className="select-text">
                                NÃO MOSTRAR O MEU NOME
                            </label>
                        </div>
                    </div>
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
                </div>
                <div className='comment-container'>
                    <h3 className="title-ticket">
                        GOSTARIA DE DEIXAR UM COMENTÁRIO
                    </h3>
                    <div className='line' />
                    <div className="comment">
                        <textarea
                            id="about"
                            name="about"
                            rows={3}
                            className="custom-textarea"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="row-ticket">
                <h3 className="title-ticket">
                    QUAL O MONTANTE QUE DESEJA DOAR
                </h3>
                <div className="line" />
                <div className="container-button">
                    <div className="buttons-group">
                        <div className="cheaper">
                            <Button className="custom-button-amount" onClick={() => prepareAmount(1)}>€1</Button>
                            <Button className="custom-button-amount" onClick={() => prepareAmount(5)}>€5</Button>
                            <Button className="custom-button-amount" onClick={() => prepareAmount(10)}>€10</Button>
                        </div>
                        <Button className="custom-button-amount" onClick={() => prepareAmount(25)}>€25</Button>
                    </div>
                </div>
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
                        value={amount}
                        onKeyPress={handleKeyPress}
                        min="0"
                        onChange={(e) => { prepareAmount(e.target.value); if (amountError) setAmountError(false); }}
                    />
                    {amountError && (
                        <div className="error-container">
                            <ExclamationCircleIcon className="error-icon" aria-hidden="true" />
                        </div>
                    )}
                </div>
                {amountError && (
                    <p className="error-text" id="email-error">
                        Insira um montante válido
                    </p>
                )}
                <div className="container-checkbox">
                    <div className="container-checkbox-part">
                        <input
                            id="honor"
                            aria-describedby="honor"
                            name="honor"
                            type="checkbox"
                            className="checkbox"
                            style={{ boxShadow: 'none' }}
                            onChange={handleDedicationsChange}
                        />
                    </div>
                    <div className="container-checkbox-part">
                        <label htmlFor="email" className="select-text">
                            DEDICAR A MINHA DOAÇÃO EM NOME OU MEMÓRIA DE ALGUÉM
                        </label>
                    </div>
                </div>
                {isDedication && (
                    <>
                        <div className="container-contribuition">
                            <input
                                type="text"
                                name="name"
                                id="dedication"
                                className="input-contribution2"
                                placeholder="Nome"
                                aria-describedby="name"
                                value={dedication}
                                onChange={(e) => { setDedication(e.target.value); if (dedicationError) setDedicationError(false); }}
                            />
                            {dedicationError && (
                                <div className="error-container">
                                    <ExclamationCircleIcon className="error-icon" aria-hidden="true" />
                                </div>
                            )}
                        </div>
                        {dedicationError && (
                            <p className="error-text" id="email-error">
                                Nome inválido
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
                <h3 className="title-ticket-extra">
                    RESUMO DA DOAÇÃO
                </h3>
                <div className="line" />
                <div className="box-amount">
                    <p className="contribution-amount">
                        EUR€ {amount === 'Outro' || amount === '' || !amount ? 0 : amount}
                    </p>
                    <p className="info-text">
                        EQUIVALE A {percentage}% DE UM FURO
                    </p>
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
                    {donationError && (
                        <p className="error-text" id="address-error">
                            Erro ao processar a doação, por favor tente novamente. Se o erro persistir, por favor contacte-nos através do email <a href="mailto:gala@thirstproject.pt" className="text-[#17CACE]">gala@thirstproject.pt</a>
                        </p>
                    )}
                </div>
            </div>
        </Container>
    )
}
