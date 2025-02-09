import React, { useEffect, useState } from 'react';
import { Image, Button } from 'react-bootstrap';
import { ExclamationCircleIcon } from '@heroicons/react/outline';
import mbway from '../assets/mbway.png';
import multibanco from '../assets/multibanco.png';
import MultibancoModel from '../modals/MultibancoModel';
import MbwayModel from '../modals/MbwayModel';
import { addDoc, doc, collection, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

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
    const [referenceCreated, setReferenceCreated] = useState(false); // Estado para evitar fechamento antecipado

    useEffect(() => {
        console.log("📌 Estado atualizado do modal MBWAY:", mbwayModalVisible);
    }, [mbwayModalVisible]);

    const changeFromMultibanco = () => {
        setPayment(prevInfo => ({ ...prevInfo, status: 'completed' }));
        setSummary(prevSummary => ({ ...prevSummary, status: 'current' }));
    };

    const validateDonation = async () => {
        setBlockButton(true);
        setInternalError(false);

        if (paymentType === "none") {
            setBlockButton(false);
            setPaymentTypeError(true);
            return;
        }

        if (paymentType === "mbway") {
            if (phone.length !== 9 || !/^\d+$/.test(phone)) {
                setPhoneError(true);
                setBlockButton(false);
                return;
            }
        }

        if (!phoneError && paymentType === "mbway") {
            try {
                const updatedInfo = {
                    ...payment.info,
                    type: "mbway",
                    phone: phone || "",
                    createdAt: new Date(),
                    referenceCreated: false,
                    error: false,
                    referencia: null,
                    entidade: null,
                };

                console.log("🔍 Detalhes de updatedInfo antes de salvar:", updatedInfo);

                const docRef = await addDoc(collection(db, "afterGala"), updatedInfo);
                console.log("🔍 docRef retornado pelo Firestore:", docRef);

                if (!docRef || !docRef.id) {
                    console.error("❌ docRef ou ID está indefinido. Verifique a criação do documento.");
                    setInternalError("Erro ao criar a doação. Tente novamente.");
                    setBlockButton(false);
                    return;
                }

                console.log("✅ Doação criada com sucesso no Firestore:", updatedInfo);

                let donationStatus = { ...updatedInfo, id: docRef.id };
                for (let i = 0; i < 5; i++) {
                    const docSnapshot = await getDoc(doc(db, "afterGala", donationStatus.id));
                    if (docSnapshot.exists()) {
                        donationStatus = { ...docSnapshot.data(), id: donationStatus.id };
                        console.log("🔄 Atualização do documento:", donationStatus);

                        if (donationStatus.referenceCreated) {
                            console.log("✅ Referência criada com sucesso!");

                            // Atualiza estado e evita fechamento precoce
                            setReferenceCreated(true);
                            setMBwayModalVisible(true);

                            setTimeout(() => {
                                console.log("📌 Estado do modal MBWAY atualizado:", mbwayModalVisible);
                            }, 100);

                            return;
                        }

                        if (donationStatus.error) {
                            console.error("❌ Erro na criação da referência:", donationStatus.error);
                            setInternalError("Erro ao criar a referência. Verifique os dados.");
                            setBlockButton(false);
                            return;
                        }
                    }

                    await new Promise((resolve) => setTimeout(resolve, 7000));
                }

                console.error("❌ Referência não foi criada no tempo esperado.");
                setInternalError("Ocorreu um problema ao criar a referência.");
            } catch (error) {
                console.error("❌ Erro ao criar/verificar a doação no Firestore:", error);
                setInternalError(`Erro inesperado: ${error.message}`);
            } finally {
                setBlockButton(false);
            }
        }

        if (paymentType === "multibanco") {
            try {
                const updatedInfo = {
                    ...payment.info,
                    type: "multibanco",
                    createdAt: new Date(),
                    referenceCreated: false,
                    error: false,
                    referencia: null,
                    entidade: null,
                };
    
                console.log("🔍 Detalhes de updatedInfo antes de salvar (Multibanco):", updatedInfo);
    
                const docRef = await addDoc(collection(db, "afterGala"), updatedInfo);
                if (!docRef || !docRef.id) {
                    console.error("❌ docRef ou ID está indefinido. Verifique a criação do documento.");
                    setInternalError("Erro ao criar o pagamento Multibanco. Tente novamente.");
                    setBlockButton(false);
                    return;
                }
    
                console.log("✅ Pagamento Multibanco criado com sucesso no Firestore:", updatedInfo);
    
                let donationStatus = { ...updatedInfo, id: docRef.id };
                for (let i = 0; i < 5; i++) {
                    const docSnapshot = await getDoc(doc(db, "afterGala", donationStatus.id));
                    if (docSnapshot.exists()) {
                        donationStatus = { ...docSnapshot.data(), id: donationStatus.id };
                        console.log("🔄 Atualização do documento (Multibanco):", donationStatus);
    
                        if (donationStatus.referenceCreated) {
                            console.log("✅ Referência Multibanco criada com sucesso!");
    
                            setMBModalVisible(true); // Exibir modal Multibanco
                            setMBInfo({
                                referencia: donationStatus.referencia,
                                entidade: donationStatus.entidade,
                                valor: donationStatus.valor,
                            });
    
                            return;
                        }
    
                        if (donationStatus.error) {
                            console.error("❌ Erro na criação da referência Multibanco:", donationStatus.error);
                            setInternalError("Erro ao criar a referência Multibanco. Verifique os dados.");
                            setBlockButton(false);
                            return;
                        }
                    }
    
                    await new Promise((resolve) => setTimeout(resolve, 7000));
                }
    
                console.error("❌ Referência Multibanco não foi criada no tempo esperado.");
                setInternalError("Ocorreu um problema ao criar a referência Multibanco.");
            } catch (error) {
                console.error("❌ Erro ao criar/verificar a referência Multibanco no Firestore:", error);
                setInternalError(`Erro inesperado: ${error.message}`);
            } finally {
                setBlockButton(false);
            }
        }

    };

    return (
        <>
            <div className="row-ticket">
                <h3 className="title-ticket-extra">
                    PAGAMENTO - SELECIONE O MÉTODO
                </h3>
                <div className="line" />
                <div className="mx-auto mt-5 mb-5">
                    <div className="flex items-center justify-center rounded-full">
                        <Button
                            className={`flex items-center ${paymentType === 'multibanco' ? 'bg-[#17CACE]' : 'bg-white/10'} me-3 rounded-lg p-1`}
                            onClick={() => { setPaymentType('multibanco'); setPaymentTypeError(false); }}
                        >
                            <Image src={multibanco} alt="multibanco" width={40} height={40} />
                        </Button>
                        <Button
                            className={`flex items-center ${paymentType === 'mbway' ? 'bg-[#17CACE]' : 'bg-white/10'} me-3 rounded-lg p-1`}
                            onClick={() => { setPaymentType('mbway'); setPaymentTypeError(false); }}
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
                    <MbwayModel
                        setMBwayModalVisible={(state) => {
                            console.log("🔄 Tentativa de fechar modal:", state);
                            if (!referenceCreated) return; // Evita fechamento antes da referência ser criada
                            setMBwayModalVisible(state);
                            if (!state) {
                                // Só vai para Summary se o modal foi fechado manualmente
                                console.log("✅ Modal fechado, navegando para Summary");
                                setSummary(prevSummary => ({ ...prevSummary, status: 'current' }));
                            }
                        }}
                        changeFromMultibanco={changeFromMultibanco}
                    />
                )}

                {paymentType === 'mbway' && (
                    <div className="container-contribuition">
                        <input
                            type="number"
                            name="phone"
                            className="input-contribution2"
                            placeholder="Número de telefone (sem indicativo)"
                            value={phone}
                            onChange={(e) => { setPhone(e.target.value); setPhoneError(false); }}
                        />
                        {phoneError && <p className="error-text">Número inválido</p>}
                    </div>
                )}

                <div className="payment-button">
                    <Button className="button" onClick={validateDonation} disabled={blockButton}>
                        {blockButton ? <div className="loader"></div> : 'CONTINUAR'}
                    </Button>
                    {internalError && <p className="error-text">{internalError}</p>}
                </div>
            </div>
        </>
    );
}
