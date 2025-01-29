import React, { useEffect, useState } from 'react';
import { Image, Button } from 'react-bootstrap';
import { ExclamationCircleIcon } from '@heroicons/react/outline';
import mbway from '../assets/mbway.png';
import multibanco from '../assets/multibanco.png';
import MultibancoModel from '../modals/MultibancoModel';
import MbwayModel from '../modals/MbwayModel';
import { getDonationById, editDonation } from '../firebase/firebase';
import '../style/payment.css'
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
            <div className="container2">
                <h3 className="title-ticket-extra">
                    PAGAMENTO - SELECIONE O MÉTODO
                </h3>
                <div className="line"/>
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
                                        <ExclamationCircleIcon className="erro-icon" aria-hidden="true" />
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
                <div className="payment-button">
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
                        <>
                            <p className="error-text" id="address-error">
                                {paymentType === 'multibanco' ? 'Ocorreu um erro. Por favor, tente novamente.' :
                                'Ocorreu um erro. Por favor, tente novamente ou verifique o limite de compras diárias do MBway.'}
                            </p>
                            <p className="error-text" id="address-error">
                                Se o erro persistir por favor contacte-nos através do email gala@thirstproject.pt
                            </p>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}

/*<div class="container-payment">
                    <div class="button-group-payment">
                        <button class="payment-button1 multibanco" onClick={() => { setPaymentType('multibanco'); if (paymentTypeError) setPaymentTypeError(false); }}>
                            <Image src={multibanco} alt="multibanco" width={40} height={40} />
                        </button>
                        <button class="payment-button1 mbway" onClick={() => { setPaymentType('mbway'); if (paymentTypeError) setPaymentTypeError(false); }}>
                            <Image src={mbway} alt="mbway" width={40} height={40} />
                        </button>
                    </div>
                {paymentTypeError && (
                    <p className="error-text" id="name-error">
                        Por favor selecione um método de pagamento
                    </p>
                )}
            </div>*/
