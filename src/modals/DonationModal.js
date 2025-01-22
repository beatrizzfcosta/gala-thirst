import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'; // Import the specific solid icon you want to use
import { ExclamationCircleIcon } from '@heroicons/react/20/solid'

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
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <div className="fixed inset-0 z-10 w-screen h-screen flex items-center justify-center bg-transparent">
                                <Dialog.Panel style={{borderRadius: '2rem' }} className="relative transform overflow-hidden bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl sm:p-6 mx-5 sm:mx-auto">
                                    <div>
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center">
                                            <FontAwesomeIcon icon={faBell} size="3x" style={{color: "#192066"}} />
                                        </div>
                                        <div className="mt-3 text-center sm:mt-5">
                                            <Dialog.Title as="h3" className="text-xl font-extrabold leading-6 text-[#17CACE]">
                                                ATENÇÃO!
                                            </Dialog.Title>
                                            <div className="mt-2">
                                                <p className="text-sm font-bold text-thirst-dark-grey">
                                                    É A NOSSA PRIMEIRA GALA... CONSEGUE DIZER-NOS O MONTANTE COM QUE PODERÁ CONTRIBUIR?
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5 sm:mt-6 flex flex-col justify-center">
                                        {!inputOpen && (
                                            <>
                                                <Button
                                                    className="inline-flex w-full mb-4 justify-center rounded-md bg-[#17CACE] px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-thirst-grey focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                    onClick={() => setInputOpen(true)}
                                                >
                                                    JÁ SEI O MONTANTE QUE QUERO DOAR
                                                </Button>
                                                <Button
                                                    className="inline-flex w-full mb-4 justify-center rounded-md bg-[#17CACE] px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-thirst-grey focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                    onClick={setFutureDonationTrue}
                                                >
                                                    AINDA NÃO SEI O MONTANTE QUE QUERO DOAR
                                                </Button>
                                            </>
                                        )}
                                        {inputOpen && (
                                            <>
                                                <div className="relative mt-9 rounded-md shadow-sm">
                                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                        <span className="text-[#17CACE] sm:text-sm font-medium">EUR€</span>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        name="price"
                                                        id="price"
                                                        className="block w-full rounded-sm border-0 py-1.5 pl-14 pr-6 text-gray-900 ring-2 ring-inset ring-[#17CACE] placeholder:text-[#17CACE] focus:ring-2 focus:ring-inset focus:ring-[#17CACE] sm:text-sm sm:leading-6"
                                                        placeholder="Montante"
                                                        min="0"
                                                        onKeyPress={handleKeyPress}
                                                        onChange={(e) => { setAmount(e.target.value); if (amountError) setAmountError(false); }}
                                                    />
                                                    {amountError && (
                                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
                                                        </div>
                                                    )}
                                                </div>
                                                {amountError && (
                                                    <p className="text-sm text-red-600" id="name-error">
                                                        Insira um montante válido
                                                    </p>
                                                )}
                                                <Button
                                                    className="inline-flex w-full justify-center rounded-md mb-5 mt-5 bg-[#17CACE] px-3 py-2 text-xs font-semibold text-white shadow-md hover:bg-thirst-grey focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                                    onClick={onFutureDonationCheckout}
                                                >
                                                    CONTINUAR
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                    <div className='flex justify-center'>
                                        <Button
                                            className="inline-flex w-full justify-center rounded-md bg-[#17CACE] px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-thirst-grey focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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