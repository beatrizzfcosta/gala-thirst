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
          role: `${mbInfo.valor}€`,
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
                                        <div className="mx-auto flex items-center justify-center">
                                            <Image src={logo} alt="logo" width={100} height={100} />
                                        </div>
                                        <div className="mt-3 text-center sm:mt-5">
                                            <Dialog.Title as="h3" className="text-xl font-extrabold leading-6 text-[#17CACE]">
                                                INFORMAÇÃO DE PAGAMENTO
                                            </Dialog.Title>
                                        </div>
                                    </div>
                                    <div className="mt-5 sm:mt-6 flex flex-col justify-center">
                                        <ul role="list" className="divide-y divide-gray-100">
                                            {paymentInfo.map((information) => (
                                                <li key={information.name} className="relative flex justify-between gap-x-6 py-5">
                                                    <div className="flex items-center gap-x-4">
                                                        <div className="min-w-0 flex-auto">
                                                            <p className="text-sm font-semibold leading-6 text-gray-900">
                                                                <span className="absolute inset-x-0 -top-px bottom-0" />
                                                                {information.name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm leading-6 text-gray-900">{information.role}</p>
                                                </li>
                                            ))}
                                        </ul>
                                        <Button
                                            className="inline-flex w-full justify-center rounded-md bg-[#17CACE] px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-thirst-grey focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            onClick={changePage}
                                        >
                                            FECHAR
                                        </Button>
                                        <p className="text-sm mt-3 text-red-600 text-center" id="name-error">
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