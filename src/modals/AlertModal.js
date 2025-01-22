import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'; // Import the specific solid icon you want to use

export default function AlertModal({setModalVisible, setAddLifePage, setOtherContribution, }) {
    const [open, setOpen] = useState(true)

    const closeModal = () => {
        setOpen(false)
        setModalVisible(false)
    }

    const scrollToTop = () => {
        window.scrollTo(0, 0);
    };

    const setContributionPage = () => {
        setOtherContribution(1)
        scrollToTop();
        setAddLifePage(true)
        closeModal()
    }

    const setInfoPage = () => {
        setOtherContribution(2)
        scrollToTop();
        closeModal()
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
                                                    ULTRAPASSOU OS 250€! NÃO SE ESQUEÇA, IRÁ EXISTIR UM MOMENTO NA GALA ONDE TAMBÉM PODERÁ FAZER DOAÇÕES.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5 sm:mt-6 flex flex-col justify-center">
                                        <Button
                                            className="inline-flex w-full mb-4 justify-center rounded-md bg-[#17CACE] px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-thirst-grey focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            onClick={setContributionPage}
                                        >
                                            QUERO CONTRIBUIR MAIS DE 250€ PELA MINHA COMPRA
                                        </Button>
                                        <Button
                                            className="inline-flex w-full mb-4 justify-center rounded-md bg-[#17CACE] px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-thirst-grey focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            onClick={setInfoPage}
                                        >
                                            SABER MAIS SOBRE AS DOAÇÕES NA GALA
                                        </Button>
                                        <Button
                                            className="inline-flex w-full justify-center rounded-md bg-[#17CACE] px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-thirst-grey focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            onClick={closeModal}
                                        >
                                            VOLTAR (&lt; 250€)
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