import { Container, Button } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { addDonation } from '../firebase/firebase';

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
            const result = await addDonation(info);

            if (result) {
                setBlockButton(false);
                setDonation(prevDonation => ({ ...prevDonation, status: 'completed' }));
                setPayment(prevPayment => ({ ...prevPayment, status: 'current', info: info, infoId: result }));
            } else {
                setBlockButton(false);
                setDonationError(true);
            }
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
        <Container className="flex flex-col md:flex-row mx-auto mt-2">
            <div className="flex-1 p-8">
                <h3 className="block text-xs font-bold leading-6 text-gray-900">
                    COMPLETE COM A SUA INFORMAÇÃO
                </h3>
                <div>
                    <div className="relative mt-5 rounded-md shadow-sm">
                        <input
                            type="text"
                            name="name"
                            id="name"
                            className={`block w-full rounded-sm border-0 py-1.5 pr-10 text-black-900 ring-2 ring-inset ring-black placeholder:text-black focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 ${isNameHidden ? 'disabled' : ''
                                }`}
                            placeholder="Nome"
                            aria-describedby="name"
                            disabled={isNameHidden}
                            value={name}
                            onChange={(e) => { setName(e.target.value); if (nameError) setNameError(false); }}
                        />
                        {nameError && (
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                            </div>
                        )}
                    </div>
                    {nameError && (
                        <p className="text-sm text-red-600" id="email-error">
                            Nome inválido
                        </p>
                    )}
                    <div className="relative flex items-start">
                        <div className="flex h-6 items-center">
                            <input
                                id="hide-name"
                                aria-describedby="name"
                                name="name"
                                type="checkbox"
                                className="h-3 w-3 rounded-full text-[#17CACE]"
                                style={{ boxShadow: 'none' }}
                                onChange={handleCheckboxChange}
                            />
                        </div>
                        <div className="ml-1 text-xxs leading-6">
                            <label htmlFor="comments" className=" text-gray-900">
                                NÃO MOSTRAR O MEU NOME
                            </label>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="relative mt-5 rounded-md shadow-sm">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="block w-full rounded-sm border-0 py-1.5 pr-10 text-black-900 ring-2 ring-inset ring-black placeholder:text-black focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                            placeholder="Email"
                            aria-invalid="true"
                            aria-describedby="email-error"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(false); }}
                        />
                        {emailError && (
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                            </div>
                        )}
                    </div>
                    {emailError && (
                        <p className="text-sm mb-2 text-red-600" id="email-error">
                            Endereço de email inválido
                        </p>
                    )}
                    <div className="relative flex items-start">
                        <div className="flex h-6 items-center">
                            <input
                                id="email"
                                aria-describedby="email"
                                name="email"
                                type="checkbox"
                                className="h-3 w-3 rounded-full text-[#17CACE]"
                                style={{ boxShadow: 'none' }}
                                onChange={handleContactChange}
                            />
                        </div>
                        <div className="ml-1 text-xxs leading-6">
                            <label htmlFor="email" className="text-gray-900">
                                GOSTARIA DE SER CONTACTADO NO FUTURO
                            </label>
                        </div>
                    </div>
                </div>
                <div className='mt-5'>
                    <h3 className="block text-xs font-bold leading-6 text-gray-900">
                        GOSTARIA DE DEIXAR UM COMENTÁRIO
                    </h3>
                    <div className="mt-2">
                        <textarea
                            id="about"
                            name="about"
                            rows={3}
                            className="block w-full rounded-sm border-0 py-1.5 text-gray-900 shadow-sm ring-2 ring-inset ring-black placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="flex-1 p-8">
                <h3 className="block text-xs font-bold leading-6 text-gray-900">
                    QUAL O MONTANTE QUE DESEJA DOAR
                </h3>
                <div className="mt-5 flex flex-col sm:auto">
                    <div
                        className={`flex flex-col sm:flex-row flex-wrap justify-between gap-4`}
                        style={window.innerWidth > 400 ? { width: '100%' } : { width: 'auto' }}
                    >
                        <Button
                            className={`rounded-md shadow-md w-full bg-[#c8f3f4] px-6 py-2 text-sm font-semibold text-black shadow-md hover:bg-[#17CACE]`}
                            onClick={() => prepareAmount(1)}
                        >
                            €1
                        </Button>
                        <Button
                            className={`rounded-md shadow-md w-full bg-[#c8f3f4] px-6 py-2 text-sm font-semibold text-black shadow-md hover:bg-[#17CACE]`}
                            onClick={() => prepareAmount(5)}
                        >
                            €5
                        </Button>
                        <Button
                            className={`rounded-md shadow-md w-full bg-[#c8f3f4] px-6 py-2 text-sm font-semibold text-black shadow-md hover:bg-[#17CACE]`}
                            onClick={() => prepareAmount(10)}
                        >
                            €10
                        </Button>
                        <Button
                            className={`rounded-md shadow-md w-full bg-[#c8f3f4] px-6 py-2 text-sm font-semibold text-black shadow-md hover:bg-[#17CACE]`}
                            onClick={() => prepareAmount(25)}
                        >
                            €25
                        </Button>
                    </div>

                </div>
                <div className="relative mt-5 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-black ssm:text-sm font-medium">EUR€</span>
                    </div>
                    <input
                        type="number"
                        name="price"
                        id="price"
                        className="block w-full rounded-sm border-0 py-1.5 pl-14 pr-6 text-gray-900 ring-2 ring-inset ring-black placeholder:text-black focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                        placeholder="Outro"
                        value={amount}
                        onKeyPress={handleKeyPress}
                        min="0"
                        onChange={(e) => { prepareAmount(e.target.value); if (amountError) setAmountError(false); }}
                    />
                    {amountError && (
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                        </div>
                    )}
                </div>
                {amountError && (
                    <p className="text-sm mb-2 text-red-600" id="email-error">
                        Insira um montante válido
                    </p>
                )}
                <div className="mt-4 relative flex items-start">
                    <div className="flex h-6 items-center">
                        <input
                            id="honor"
                            aria-describedby="honor"
                            name="honor"
                            type="checkbox"
                            className="h-3 w-3 rounded-full text-[#17CACE]"
                            style={{ boxShadow: 'none' }}
                            onChange={handleDedicationsChange}
                        />
                    </div>
                    <div className="ml-1 text-xxs leading-6">
                        <label htmlFor="email" className=" text-gray-900">
                            DEDICAR A MINHA DOAÇÃO EM NOME OU MEMÓRIA DE ALGUÉM
                        </label>
                    </div>
                </div>
                {isDedication && (
                    <>
                        <div className="relative mt-2 rounded-md shadow-sm">
                            <input
                                type="text"
                                name="name"
                                id="dedication"
                                className="block w-full rounded-sm border-0 py-1.5 pr-10 text-black-900 ring-2 ring-inset ring-black placeholder:text-black focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                                placeholder="Nome"
                                aria-describedby="name"
                                value={dedication}
                                onChange={(e) => { setDedication(e.target.value); if (dedicationError) setDedicationError(false); }}
                            />
                            {dedicationError && (
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                                </div>
                            )}
                        </div>
                        {dedicationError && (
                            <p className="text-sm mb-2 text-red-600" id="email-error">
                                Nome inválido
                            </p>
                        )}
                    </>
                )}
                <div className="relative mt-3 flex items-start">
                    <div className="flex h-6 items-center">
                        <input
                            id="nif"
                            aria-describedby="nif"
                            name="nif"
                            type="checkbox"
                            className="h-3 w-3 rounded-full text-[#17CACE]"
                            style={{ boxShadow: 'none' }}
                            onChange={handleNifChange}
                        />
                    </div>
                    <div className="ml-1 text-xxs leading-6">
                        <label htmlFor="email" className=" text-gray-900">
                            DESEJO EMITIR FATURA
                        </label>
                    </div>
                </div>
                {isNif && (
                    <>
                        <div className="relative rounded-md shadow-sm">
                            <input
                                type="text"
                                name="name"
                                id="dedication"
                                className="block mt-1 w-full rounded-sm border-0 py-1.5 pr-10 text-black-900 ring-2 ring-inset ring-black placeholder:text-black focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                                placeholder="Nome de emissão da fatura"
                                aria-describedby="name"
                                value={nif.name}
                                onChange={(e) => { setNif(prevName => ({ ...prevName, name: e.target.value })); if (nifError.address) setNifError(prevName => ({ ...prevName, name: false })); }}
                            />
                            {nifError.name && (
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                                </div>
                            )}
                        </div>
                        {nifError.name && (
                            <p className="text-sm mb-2 text-red-600" id="name-error">
                                Nome inválido
                            </p>
                        )}
                        <div className="relative rounded-md shadow-sm">
                            <input
                                type="number"
                                name="nif"
                                id="dedication"
                                className="block w-full mt-4 rounded-sm border-0 py-1.5 pr-10 text-black-900 ring-2 ring-inset ring-black placeholder:text-black focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                                placeholder="NIF"
                                aria-describedby="nif"
                                value={nif.nif}
                                onKeyPress={handleKeyPress}
                                onChange={(e) => { setNif(prevNif => ({ ...prevNif, nif: e.target.value })); if (nifError.nif) setNifError(prevNif => ({ ...prevNif, nif: false })); }}
                            />
                            {nifError.nif && (
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                                </div>
                            )}
                        </div>
                        {nifError.nif && (
                            <p className="text-sm mb-2 text-red-600" id="nif-error">
                                NIF inválido
                            </p>
                        )}
                        <div className="relative rounded-md shadow-sm">
                            <input
                                type="text"
                                name="address"
                                id="dedication"
                                className="block w-full mt-4 rounded-sm border-0 py-1.5 pr-10 text-black-900 ring-2 ring-inset ring-black placeholder:text-black focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                                placeholder="Morada"
                                aria-describedby="address"
                                value={nif.address}
                                onChange={(e) => { setNif(prevAddress => ({ ...prevAddress, address: e.target.value })); if (nifError.address) setNifError(prevAddress => ({ ...prevAddress, address: false })); }}
                            />
                            {nifError.address && (
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                                </div>
                            )}
                        </div>
                        {nifError.address && (
                            <p className="text-sm mb-2 text-red-600" id="address-error">
                                Morada inválida
                            </p>
                        )}
                    </>
                )}

                <div className="w-full mt-3 ring-1 ring-[#17CACE]" />

                <h3 className="block mt-5 text-xs font-bold leading-6 text-gray-900">
                    RESUMO DA DOAÇÃO
                </h3>

                <div className="mt-5 flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold text-[#17CACE]">
                        EUR€ {amount === 'Outro' || amount === '' || !amount ? 0 : amount}
                    </p>
                    <p className="mt-4 text-sm font-medium text-gray-900">
                        EQUIVALE A {percentage}% DE UM FURO
                    </p>
                    <Button
                        className={`bg-black rounded-sm mt-8 px-10 py-2 text-sm font-semibold text-white shadow-md ring-2 ring-black  ${!blockButton ? 'hover:bg-[#17CACE] hover:text-white hover:ring-[#17CACE]' : ''}`}
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
                        <p className="text-sm text-center mt-2 text-red-600" id="address-error">
                            Erro ao processar a doação, por favor tente novamente. Se o erro persistir, por favor contacte-nos através do email <a href="mailto:gala@thirstproject.pt" className="text-[#17CACE]">gala@thirstproject.pt</a>
                        </p>
                    )}
                </div>
            </div>
        </Container>
    )
}
