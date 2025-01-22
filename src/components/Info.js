import { Container, Button, Image } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import TermsModal from '../modals/TermsModal';
import { addTicketBuyer, getTicketById } from '../firebase/firebase';
import mbway from '../assets/mbway.png';
import multibanco from '../assets/multibanco.png';
import MultibancoModel from '../modals/MultibancoModel';
import MbwayModel from '../modals/MbwayModel';

export default function Info({ setInfo, setSummary, contribution }) {
    const [emailError, setEmailError] = useState(false);
    const [names, setNames] = useState([]);
    const [email, setEmail] = useState('');
    const [nif, setNif] = useState({nif: '', name: '', address: ''});
    const [isNif, setIsNif] = useState(false);
    const [nifError, setNifError] = useState({nif: false, name: false, address: false});
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

    const changeFromMultibanco = () => {
        setInfo(prevInfo => ({...prevInfo, status: 'completed' }));
        setSummary(prevSummary => ({...prevSummary, status: 'current' }));
    };

    const renderInputBoxes = () => {
        const inputBoxes = [];
        for (let i = 1; i < contribution.tickets; i++) {
          inputBoxes.push(
            <div key={i} className="relative mt-2 rounded-md shadow-sm">
              <input
                type="text"
                name={`ticket-${i}`}
                id={`ticket-${i}`}
                className="block w-full rounded-sm border-0 py-1.5 pr-10 text-black-900 ring-2 ring-inset ring-[#17CACE] placeholder:text-black focus:ring-2 focus:ring-inset focus:ring-[#17CACE] sm:text-sm sm:leading-6"
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
                setNifError(prevNif => ({...prevNif, nif: true }));
                setBlockButton(false);
            }
            if (nif.name.trim() === '') {
                setNifError(prevName => ({...prevName, name: true }));
                setBlockButton(false);
            }
            if (nif.address.trim() === '') {
                setNifError(prevAddress => ({...prevAddress, address: true }));
                setBlockButton(false);
            }
        }

        if (paymentType === 'none') {
            setBlockButton(false);
            setPaymentTypeError(true);
        }
        if ((names.length !== contribution.tickets && checkboxChecked) || names.some(name => name.trim() === '') || names.length === 0) {
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
            }

            const result = await addTicketBuyer(info);
            if (paymentType === 'mbway') {
                setTimeout(async() => {
                    if (result !== false) {
                        let ticketUpdated = await getTicketById(result);
                        if (ticketUpdated !== null && ticketUpdated.referenceCreated) {
                            setBlockButton(false);
                            setMBwayModalVisible(true);
                            return;
                        } else {
                            setTimeout(async() => {
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
                setTimeout(async() => {
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
                            setTimeout(async() => {
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
        setNif({nif: '', name: '', address: ''});
        setNifError({nif: false, name: false, address: false});
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
        <Container className="flex flex-col md:flex-row mx-auto mt-2">
            <div className="flex-1 p-8">
                <h3 className="block text-xs font-bold leading-6 text-gray-900">
                    COMPLETE COM A SUA INFORMAÇÃO
                </h3>
                <div className="w-full mt-1 ring-1 ring-[#17CACE]"/>
                <div>
                    <div className="relative mt-8 rounded-md shadow-sm">
                        <input
                            type="text"
                            name="name"
                            id="name"
                            className="block w-full rounded-sm border-0 py-1.5 pr-10 text-black-900 ring-2 ring-inset ring-[#17CACE] placeholder:text-black focus:ring-2 focus:ring-inset focus:ring-[#17CACE] sm:text-sm sm:leading-6"
                            placeholder="Nome"
                            aria-describedby="name"
                            value={names[0]}
                            onChange={(e) => handleNameChange(0, e.target.value)}
                        />
                    </div>
                    {contribution.tickets > 1 && (
                        <div className="relative flex items-start">
                            <div className="flex h-6 items-center">
                                <input
                                    id="hide-name"
                                    aria-describedby="name"
                                    name="name"
                                    type="checkbox"
                                    className="h-3 w-3 rounded-full text-[#17CACE]"
                                    style={{ boxShadow: 'none' }}
                                    onChange={() => { setCheckboxChecked(!checkboxChecked); if (!checkboxChecked) setNames([names[0]]); }}
                                />
                            </div>
                            <div className="ml-1 text-xxs leading-6">
                                <label htmlFor="comments" className=" text-gray-900">
                                    ATRIBUIR NOMES INDIVIDUAIS A CADA BILHETE
                                </label>
                            </div>
                        </div>
                    )}
                    {checkboxChecked && renderInputBoxes()}
                    {namesError && (
                        <p className="text-sm text-red-600" id="email-error">
                            Preencha todos os campos
                        </p>
                    )}
                </div>
                <div>
                    <div className="relative mt-8 rounded-md shadow-sm">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="block w-full rounded-sm border-0 py-1.5 pr-10 text-black-900 ring-2 ring-inset ring-[#17CACE] placeholder:text-black focus:ring-2 focus:ring-inset focus:ring-[#17CACE] sm:text-sm sm:leading-6"
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

                    <h3 className="block text-xs mt-7 font-bold leading-6 text-gray-900">
                        VALOR A PAGAR
                    </h3>
                    <div className="w-full mt-1 ring-1 ring-[#17CACE]"/>
                    <p className="text-2xl mt-5 font-bold text-black">
                        EUR€ {contribution.total ? contribution.total : contribution.tickets * 25}
                    </p>
                </div>
            </div>
            <div className="flex-1 p-8">
                <h3 className="block text-xs font-bold leading-6 text-gray-900">
                    PAGAMENTO - SELECIONE O MÉTODO
                </h3>
                <div className="w-full mt-1 ring-1 ring-[#17CACE]"/>
                <div className="mx-auto mt-5 mb-5">
                    <div className="flex items-center justify-center rounded-full">
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
                        <p className="text-sm text-center mb-2 text-red-600" id="name-error">
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
                        <div className="relative rounded-md shadow-sm">
                            <input
                                type="number"
                                name="phone"
                                id="dedication"
                                className="block w-full mt-4 rounded-sm border-0 py-1.5 text-black-900 ring-2 ring-inset ring-[#17CACE] placeholder:text-black focus:ring-2 focus:ring-inset focus:ring-[#17CACE] sm:text-sm sm:leading-6"
                                placeholder="Número de telefone (sem indicativo)"
                                aria-describedby="phone"
                                value={phone}
                                onKeyPress={handleKeyPress}
                                onChange={(e) => { setPhone(e.target.value); if (phoneError) setPhoneError(false); }}
                            />
                            {phoneError && (
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                                    </div>
                                )}
                        </div>
                        {phoneError && (
                            <p className="text-sm text-center mb-2 text-red-600" id="name-error">
                                Número inválido (caso tenha introduzido indicativo, retire-o)
                            </p>
                        )}
                    </>
                )}
                <div className="relative flex items-start mb-5">
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
                                className="block mt-1 w-full rounded-sm border-0 py-1.5 pr-10 text-black-900 ring-2 ring-inset ring-[#17CACE] placeholder:text-black focus:ring-2 focus:ring-inset focus:ring-[#17CACE] sm:text-sm sm:leading-6"
                                placeholder="Nome de emissão da fatura"
                                aria-describedby="name"
                                value={nif.name}
                                onChange={(e) => { setNif(prevName => ({...prevName, name: e.target.value })); if (nifError.address) setNifError(prevName => ({...prevName, name: false })); }}
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
                                className="block w-full mt-4 rounded-sm border-0 py-1.5 pr-10 text-black-900 ring-2 ring-inset ring-[#17CACE] placeholder:text-black focus:ring-2 focus:ring-inset focus:ring-[#17CACE] sm:text-sm sm:leading-6"
                                placeholder="NIF"
                                aria-describedby="nif"
                                value={nif.nif}
                                onKeyPress={handleKeyPress}
                                onChange={(e) => { setNif(prevNif => ({...prevNif, nif: e.target.value })); if (nifError.nif) setNifError(prevNif => ({...prevNif, nif: false })); }}
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
                                className="block w-full mt-4 rounded-sm border-0 py-1.5 pr-10 text-black-900 ring-2 ring-inset ring-[#17CACE] placeholder:text-black focus:ring-2 focus:ring-inset focus:ring-[#17CACE] sm:text-sm sm:leading-6"
                                placeholder="Morada"
                                aria-describedby="address"
                                value={nif.address}
                                onChange={(e) => { setNif(prevAddress => ({...prevAddress, address: e.target.value })); if (nifError.address) setNifError(prevAddress => ({...prevAddress, address: false })); }}
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
                
                <div className="relative flex items-start mt-4">
                    <Button
                        className={`text-left ml-1 text-xxs leading-6 ${termsAccepted ? 'text-[#17CACE] font-bold' : 'text-gray-900'} hover:text-[#17CACE] hover:font-bold`}
                        onClick={handleTermsChange}
                    >
                        ACEITO OS TERMOS E CONDIÇÕES DA GALA DO THIRST PROJECT PORTUGAL
                    </Button>
                </div>
                {termsError && (
                    <p className="text-sm mb-2 text-red-600" id="address-error">
                        Aceite os termos e condições
                    </p>
                )}
                <div className="mt-5 flex flex-col items-center justify-center">
                    <Button
                        className={`rounded-sm mt-6 bg-black px-10 py-2 text-sm font-semibold text-white shadow-md ring-2 ring-black ${!blockButton ? 'hover:bg-[#17CACE] hover:text-white hover:ring-[#17CACE]' : ''}`}
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
                        <p className="text-sm mt-2 text-center text-red-600" id="address-error">
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
