import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'; // Import the specific solid icon you want to use
import '../style/modals.css'

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
                                                    ULTRAPASSOU OS 250€! NÃO SE ESQUEÇA, IRÁ EXISTIR UM MOMENTO NA GALA ONDE TAMBÉM PODERÁ FAZER DOAÇÕES.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="buttons-modal">
                                        <Button
                                            className="button-modal"
                                            onClick={setContributionPage}
                                        >
                                            QUERO CONTRIBUIR MAIS DE 250€ PELA MINHA COMPRA
                                        </Button>
                                        <Button
                                            className="button-modal"
                                            onClick={setInfoPage}
                                        >
                                            SABER MAIS SOBRE AS DOAÇÕES NA GALA
                                        </Button>
                                        <Button
                                            className="button-modal"
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