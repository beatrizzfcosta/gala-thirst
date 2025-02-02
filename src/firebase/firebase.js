import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDoc, addDoc, updateDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBrqMaTbdjSt0U5UpRf4T6WQpA3DXC5lfc",
  authDomain: "gala-thirst.firebaseapp.com",
  projectId: "gala-thirst",
  storageBucket: "gala-thirst.firebasestorage.app",
  messagingSenderId: "551601274824",
  appId: "1:551601274824:web:fc50edb7dadb78db514afd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const addTicketBuyer = async (ticketBuyer) => {
  try {
    const docRef = await addDoc(collection(db, 'ticketBuyer'), { ...ticketBuyer, referenceCreated: false });
    console.log('Pedido adicionado ao Firebase:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar documento:', error);
    return false;
  }
};

const addDonation = async (donation) => {
  try {
    const docRef = await addDoc(collection(db, 'afterGala'), donation);
    console.log('Doação adicionada:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erro ao adicionar doação:', error);
    return false;
  }
};

const updatePaymentReference = async (ticketId, referenceData) => {
  try {
    const docRef = doc(db, 'ticketBuyer', ticketId);
    await updateDoc(docRef, { ...referenceData, referenceCreated: true });
    console.log('Referência de pagamento atualizada:', referenceData);
    return true;
  } catch (error) {
    console.error('Erro ao atualizar referência:', error);
    return false;
  }
};

const getTicketById = async (ticketId) => {
  try {
    const docRef = doc(db, 'ticketBuyer', ticketId);
    const ticket = await getDoc(docRef);
    if (!ticket.exists()) return null;
    return ticket.data();
  } catch (error) {
    console.error('Erro ao obter ticket:', error, ticketId);
    return null;
  }
};

const editDonation = async (donationId, type, phone) => {
  try {
    const docRef = doc(db, 'afterGala', donationId);
    const updateData = type === 'mbway' ? { type, phone, error: false } : { type, error: false };
    await updateDoc(docRef, updateData);
    console.log('Doação editada:', updateData);
    return true;
  } catch (error) {
    console.error('Erro ao atualizar doação:', error);
    return false;
  }
};

const getDonationById = async (donationId) => {
  try {
    const docRef = doc(db, 'afterGala', donationId);
    const donation = await getDoc(docRef);
    if (!donation.exists()) return null;
    return donation.data();
  } catch (error) {
    console.error('Erro ao obter doação:', error, donationId);
    return null;
  }
};

export { db, addTicketBuyer, addDonation, getTicketById, updatePaymentReference, editDonation, getDonationById };
