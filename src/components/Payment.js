import React, { useEffect, useState } from 'react';
import { Image, Button } from 'react-bootstrap';
import { ExclamationCircleIcon } from '@heroicons/react/outline';
import mbway from '../assets/mbway.png';
import multibanco from '../assets/multibanco.png';
import MultibancoModel from '../modals/MultibancoModel';
import MbwayModel from '../modals/MbwayModel';
import { getDonationById, editDonation } from '../firebase/firebase';

export default function Payment({ setPayment, setSummary, payment }) {
    const [paymentType, setPaymentType] = useState('none');
    const [paymentTypeError, setPaymentTypeError] = useState(false);
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState(false);
    const [blockButton, setBlockButton] = useState(false);
    const [internalError, setInternalError] = useState(false);
    const [mbModalVisible, setMBModalVisible] = useState(false);
    const [mbwayModalVisible, setMBwayModalVisible] = useState(false);
    const [mbInfo, setMBInfo] = useState({});

    const changeFromMultibanco = () => {
        setPayment(prevInfo => ({...prevInfo, status: 'completed' }));
        setSummary(prevSummary => ({...prevSummary, status: 'current' }));
    };

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

    const validateDonation = async () => {
        setBlockButton(true);
        setInternalError(false);
        if (paymentType === 'mbway') {
            if (phone.length !== 9 || !/^\d+$/.test(phone)) {
                setPhoneError(true);
                setBlockButton(false);
                return;
            }
        }

        if (paymentType === 'none') {
            setBlockButton(false);
            setPaymentTypeError(true);
            return;
        }

        if (!phoneError && paymentType !== 'none') {
            let donationUpdated;
            if (paymentType === 'mbway') {
                donationUpdated = await editDonation(payment.infoId, paymentType, phone);
            } else {
                donationUpdated = await editDonation(payment.infoId, paymentType, phone);
            }
            if (paymentType === 'mbway' && donationUpdated) {
                let donationUpdated = await getDonationById(payment.infoId);
                if (donationUpdated !== null && donationUpdated.referenceCreated) {
                    setBlockButton(false);
                    setMBwayModalVisible(true);
                    return;
                } else {
                    setTimeout(async() => {
                        donationUpdated = await getDonationById(payment.infoId);
                        if (donationUpdated !== null && donationUpdated.referenceCreated) {
                            setBlockButton(false);
                            setMBwayModalVisible(true);
                            return;
                        } 
                        if (donationUpdated !== null && donationUpdated.error !== false) {
                            setInternalError(true);
                            setBlockButton(false);
                            return;
                        }
                    }, 7000)
                }
                if (donationUpdated !== null && donationUpdated.error !== false) {
                    setInternalError(true);
                    setBlockButton(false);
                    return;
                }
            } else if (paymentType === 'multibanco' && donationUpdated) {
                let donationUpdated = await getDonationById(payment.infoId);
                if (donationUpdated !== null && donationUpdated.referenceCreated) {
                    setBlockButton(false);
                    setMBInfo({
                        entidade: donationUpdated.entidade,
                        referencia: donationUpdated.referencia,
                        valor: donationUpdated.total,
                    })
                    setMBModalVisible(true);
                    return;
                } else {
                    setTimeout(async() => {
                        donationUpdated = await getDonationById(payment.infoId);
                        if (donationUpdated !== null && donationUpdated.referenceCreated) {
                            setBlockButton(false);
                            setMBInfo({
                                entidade: donationUpdated.entidade,
                                referencia: donationUpdated.referencia,
                                valor: donationUpdated.total,
                            })
                            setMBModalVisible(true);
                            return;
                        } 
                        if (donationUpdated !== null && donationUpdated.error !== false) {
                            setInternalError(true);
                            setBlockButton(false);
                            return;
                        }
                    }, 10000)
                }
                if (donationUpdated !== null && donationUpdated.error !== false) {
                    setInternalError(true);
                    setBlockButton(false);
                    return;
                }
            } else  {
                setInternalError(true);
                setBlockButton(false);
            }
        }
    }

    return (
        <>
            <div className="flex-1 p-8">
                <h3 className="block text-xs font-bold leading-6 text-gray-900">
                    PAGAMENTO - SELECIONE O MÉTODO
                </h3>
                <div className="w-full mt-1 ring-1 ring-thirst-gray"/>
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
                <div className="mt-5 flex flex-col items-center justify-center">
                    <Button
                        className={`rounded-sm mt-6 bg-white/10 px-10 py-2 text-sm font-semibold text-black shadow-md ring-2 ring-[#17CACE] ${!blockButton ? 'hover:bg-[#17CACE] hover:text-white hover:ring-[#17CACE]' : ''}`}
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
                        <>
                            <p className="text-sm mt-5 text-center text-red-600" id="address-error">
                                {paymentType === 'multibanco' ? 'Ocorreu um erro. Por favor, tente novamente.' :
                                'Ocorreu um erro. Por favor, tente novamente ou verifique o limite de compras diárias do MBway.'}
                            </p>
                            <p className="text-sm text-center text-red-600" id="address-error">
                                Se o erro persistir por favor contacte-nos através do email gala@thirstproject.pt
                            </p>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}
