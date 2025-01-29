import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Button, Image } from 'react-bootstrap'
import logo from '../assets/thirst.jpg';

export default function MbwayModel({setMBwayModalVisible, changeFromMultibanco }) {
    const [open, setOpen] = useState(true)
  
    const closeModal = () => {
        setOpen(false)
        setMBwayModalVisible(false)
    }

    const changePage = () => {
        changeFromMultibanco()
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
                                            <Image src={logo} alt="logo" width={100} height={100} />
                                        </div>
                                        <div className="attention-container">
                                            <Dialog.Title as="h3" className="attention">
                                                INFORMAÇÃO DE PAGAMENTO
                                            </Dialog.Title>
                                            <div className="info-text-container">
                                                <p className="info-text-modal">
                                                    Recebeu um pedido de MBway no seu telemóvel.
                                                </p>
                                                <p className="info-text-modal">
                                                    Tem <b>4 minutos</b> para o aceitar.
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            className="button-modal"
                                            onClick={changePage}
                                        >
                                            FECHAR
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