import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Button, Image } from 'react-bootstrap'
import logo from '../assets/thirst.jpg';

export default function MultibancoModel({setMBModalVisible, mbInfo, changeFromMultibanco }) {
    const [open, setOpen] = useState(true)
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const day = String(tomorrow.getDate()).padStart(2, '0');
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const year = tomorrow.getFullYear();
  
    const finalDate = `${day}/${month}/${year}`;
  
    const closeModal = () => {
        setOpen(false)
        setMBModalVisible(false)
    }

    const changePage = () => {
        changeFromMultibanco()
        closeModal()
    }

    const paymentInfo = [
        {
          name: 'Entidade',
          role: mbInfo.entidade,
        },
        {
          name: 'Referência',
          role: mbInfo.referencia,
        },
        {
          name: 'Valor',
          role: `${parseFloat(mbInfo.valor).toFixed(2)}€`,
        },
        {
          name: 'Prazo de Pagamento',
          role: finalDate,
        }
    ]

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
                                        </div>
                                    </div>
                                    <div className="container-multibanco">
                                        <ul role="list" className="list-multibanco">
                                            {paymentInfo.map((information) => (
                                                <li key={information.name} className="list-item-multibanco">
                                                    <div className="list-content-multibanco">
                                                        <div className="text-container-multibanco">
                                                            <p className="text-multibanco">
                                                                <span className="text-span-multibanco" />
                                                                {information.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className="info-text-modal">{information.role}</p>
                                                </li>
                                            ))}
                                        </ul>
                                        <Button
                                            className="button-modal"
                                            onClick={changePage}
                                        >
                                            FECHAR
                                        </Button>
                                        <p className="error-text" id="name-error">
                                            Antes de fechar, por favor, registe a informação de pagamento.
                                        </p>
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