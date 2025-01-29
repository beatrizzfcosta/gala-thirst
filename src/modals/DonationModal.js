import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'; // Import the specific solid icon you want to use
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import '../style/modals.css'
export default function DonationModal({setDonationModalVisible, validateDonationOnGala}) {
    const [open, setOpen] = useState(true)
    const [inputOpen, setInputOpen] = useState(false)
    const [amount, setAmount] = useState(null)
    const [amountError, setAmountError] = useState(false)

    const closeModal = () => {
        setOpen(false)
        setDonationModalVisible(false)
    }

    const handleKeyPress = (event) => {
        if (event.key === 'e') event.preventDefault();
    }

    const onFutureDonationCheckout = () => {
        if (amount === null || amount === '' || amount === 0) {
            setAmountError(true)
            return
        }
        setInputOpen(false)
        closeModal()
        validateDonationOnGala(amount)
    }

    const setFutureDonationTrue = () => {
        closeModal()
        validateDonationOnGala(null)
    }

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => {}}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="overlay-modal" />
                </Transition.Child>

                <div className="container-modal1">
                    <div className="box-modal">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                             <div className="container-modal">
                                <Dialog.Panel className="dialog-panel">
                                    <div>
                                        <div className="bell-icon-container">
                                            <FontAwesomeIcon icon={faBell} size="3x" style={{color: "#17CACE"}} />
                                        </div>
                                        <div className="attention-container">
                                            <Dialog.Title as="h3" className="attention">
                                                ATENÇÃO!
                                            </Dialog.Title>
                                            <div className="info-text-container">
                                                <p className="info-text-modal">
                                                    É A NOSSA SEGUNDA GALA... CONSEGUE DIZER-NOS O MONTANTE COM QUE PODERÁ CONTRIBUIR?
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="buttons-modal">
                                        {!inputOpen && (
                                            <>
                                                <Button
                                                    className="button-modal"
                                                    onClick={() => setInputOpen(true)}
                                                >
                                                    JÁ SEI O MONTANTE QUE QUERO DOAR
                                                </Button>
                                                <Button
                                                    className="button-modal"
                                                    onClick={setFutureDonationTrue}
                                                >
                                                    AINDA NÃO SEI O MONTANTE QUE QUERO DOAR
                                                </Button>
                                            </>
                                        )}
                                        {inputOpen && (
                                            <>
                                                <div className="container-contribuition-modal">
                                                    <div className="box-eur">
                                                        <span className="eur">EUR€</span>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        name="price"
                                                        id="price"
                                                        className="input-contribution-modal"
                                                        placeholder="Montante"
                                                        min="0"
                                                        onKeyPress={handleKeyPress}
                                                        onChange={(e) => { setAmount(e.target.value); if (amountError) setAmountError(false); }}
                                                    />
                                                    {amountError && (
                                                        <div className="error-container">
                                                            <ExclamationCircleIcon className="error-icon" aria-hidden="true" />
                                                        </div>
                                                    )}
                                                </div>
                                                {amountError && (
                                                    <p className="error-text" id="name-error">
                                                        Insira um montante válido
                                                    </p>
                                                )}
                                                <Button
                                                    className="button-modal"
                                                    onClick={onFutureDonationCheckout}
                                                >
                                                    CONTINUAR
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                    <div className='close-modal-container'>
                                        <Button
                                            className="button-modal"
                                            onClick={closeModal}
                                        >
                                            VOLTAR
                                        </Button>
                                    </div>
                                </Dialog.Panel>
                            </div>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}