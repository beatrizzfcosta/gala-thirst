import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDoc, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

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
    const docRef = await addDoc(collection(db, 'ticketBuyer'), ticketBuyer);
    const docId = docRef.id;
    return docId;
  } catch (error) {
    console.error('Error adding document: ', error);
    return false
  }
};

const addDonation = async (donation) => {
  try {
    const docRef = await addDoc(collection(db, 'afterGala'), donation);
    const docId = docRef.id;
    return docId;
  } catch (error) {
    console.error('Error adding document: ', error);
    return false
  }
};

const editDonation = async (donationId, type, phone) => {
  try {
    const docRef = doc(db, 'afterGala', donationId);
    if (type === 'mbway') {
      await updateDoc(docRef, {
        type: type,
        phone: phone,
        error: false,
      });
    } else {
      await updateDoc(docRef, {
        type: type,
        error: false,
      });
    }
    return true;
  } catch (error) {
    console.error('Error updating document: ', error);
    return false;
  }
}

const getDonationById = async (donationId) => {
  try {
    const docRef = doc(db, 'afterGala', donationId);
    const donation = await getDoc(docRef);
    if (!donation.exists()) {
      return null;
    }
    const donationBuyer = donation.data();
    return donationBuyer;
  } catch (error) {
    console.error('Error getting donation: ', error, donationId);
    return null;
  }
};

const getTicketById = async (ticketId) => {
  try {
    const docRef = doc(db, 'ticketBuyer', ticketId);
    const ticket = await getDoc(docRef);
    if (!ticket.exists()) {
      return null;
    }
    const ticketBuyer = ticket.data();
    return ticketBuyer;
  } catch (error) {
    console.error('Error getting ticket: ', error, ticketId);
    return null;
  }
};

const checkHowManyTicketsSold = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'ticketBuyer'));
    let totalTicketsSold = 0;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const ticketsSold = data.tickets || 0;
      const paid = data.paid || false;

      if (paid) {
        totalTicketsSold += ticketsSold;
      }
    });

    return totalTicketsSold;
  } catch (error) {
    console.error('Error checking tickets sold:', error);
    throw error;
  }
};

export { db, addTicketBuyer, getTicketById, checkHowManyTicketsSold, addDonation, editDonation, getDonationById };
