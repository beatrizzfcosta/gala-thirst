import { Fragment, useState, useRef, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell } from '@fortawesome/free-solid-svg-icons'; // Import the specific solid icon you want to use
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function TermsModal({ setTermsVisible, setTermsAccepted, setTermsError }) {
    const [open, setOpen] = useState(true)
    const contentRef = useRef(null)

    useEffect(() => {
        if (open && contentRef.current) {
            contentRef.current.scrollTo(0, 0)
        }
    }, [open])

    const closeModal = () => {
        setOpen(false)
        setTermsVisible(false)
    }

    const acceptTerms = () => {
        setTermsError(false)
        setTermsAccepted(true)
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
                                    <div className="close-modal">
                                        <Button
                                            className="close-modal-button"
                                            onClick={closeModal}
                                        >
                                            <span className="sr-only">Close</span>
                                            <XMarkIcon className="close-modal-icon" aria-hidden="true" />
                                        </Button>
                                    </div>
                                    <div>
                                        <div className="bell-icon-container">
                                            <FontAwesomeIcon icon={faBell} size="3x" style={{color: "#17CACE"}}/>
                                        </div>
                                        <div className="attention-container">
                                            <Dialog.Title as="h3" className="attention-terms">
                                                Termos e Condições!
                                            </Dialog.Title>
                                            <div className="modal-body">
                                                <p className="modal-text" ref={contentRef}>
                                                    <span className="type-text1">1. Introdução</span><br></br><br></br>
                                                    Os presentes Termos e Condições regem a compra de bilhete(s) para a Gala do 5º Aniversário da Associação Water Warriors, TWPT, doravante designada por Thirst Project Portugal ou TPP, incluindo 1) a regulamentação para a compra de bilhete(s), 2) autorização de captação de imagem durante todo o evento e transmissão e utilização da mesma para os fins destinados e abrangidos pela Gala e 3) os métodos estipulados para as doações monetárias.<br></br><br></br>
                                                    Ao proceder à compra do(s) bilhete(s) para a Gala do 5º Aniversário do TPP, o presente utilizador concorda em ficar vinculado pelos presentes Termos e Condições. Caso não concorde com os Termos e Condições plasmados, não prossiga com a compra do(s) bilhete(s) para a Gala do 5º Aniversário do TPP.<br></br><br></br><br></br>

                                                    <span className="type-text1">2. Compra do(s) Bilhete(s) </span><br></br><br></br>

                                                    O comprador, ao utilizar este website para a compra do(s) bilhete(s) compromete-se a fazê-lo apenas para fins legais e de acordo com os presentes Termos e Condições.<br></br><br></br>

                                                    Assim, o comprador concorda em:<br></br>
                                                    <span className="type-text2">- Não utilizar o website de qualquer forma que viole qualquer lei ou regulamento aplicável;</span><br></br>
                                                    <span className="type-text2">- Não utilizar o website de qualquer forma que possa prejudicar o Thirst Project Portugal ou a execução da Gala do 5º Aniversário do TPP;</span><br></br>
                                                    <span className="type-text2">- Não utilizar o website para fins fraudulentos ou enganosos;</span><br></br>
                                                    <span className="type-text2">- Utilizar e respeitar os métodos de pagamento estipulados;</span><br></br>
                                                    <span className="type-text2">- Não utilizar o(s) bilhete(s) adquiridos para outros fins, que não os relacionados com o Evento.</span><br></br><br></br><br></br>

                                                    <span className="type-text1">3.	Direitos de Imagem</span><br></br><br></br>
                                                    Durante a Gala do 5º Aniversário do TPP, o comprador aceita a captação de imagem para fins de transmissão, partilha e divulgação do Evento e do trabalho prosseguido pelo Thirst Project Portugal.<br></br><br></br>
                                                    Para além disso, aceita a utilização das imagens captadas para posterior partilha e publicidade.<br></br><br></br><br></br>

                                                    <span className="type-text1">4.	Doações Monetárias</span><br></br><br></br>
                                                    Se, durante o evento, o comprador manifestar interesse em realizar uma doação monetária para o Thirst Project Portugal, tendo em vista a construção de furos de água potável, no Reino de Essuatini, deve fazê-lo segundo a legislação portuguesa aplicável às regras de licitação em Leilões e segundo os ditames da Boa-Fé.<br></br><br></br><br></br>

                                                    <span className="type-text1">5.	Propriedade Intelectual</span><br></br><br></br>
                                                    A imagem do Thirst Project Portugal e todo o conteúdo e materiais nela incluídos, incluindo, sem limitação, o design, layout, logótipos, marcas, texto, imagens, gráficos, website são protegidos por direitos de propriedade intelectual e outras leis aplicáveis.<br></br><br></br>
                                                    O utilizador concorda em não reproduzir a imagem do Thirst Project Portugal, modificar, criar trabalhos derivados, executar publicamente ou explorar de outra forma qualquer a sua imagem e identidade, se de essa utilização resultar um aproveitamento enganoso ou fraudulento, que prejudique a Associação.<br></br><br></br><br></br>

                                                    <span className="type-text1">6.	Isenção de Responsabilidade</span><br></br><br></br>
                                                    O Thirst Project Portugal não fornece qualquer garantia de que o website para a compra do(s) bilhete(s) e a captação de imagem atenderão às suas necessidades ou expectativas, ou que o seu acesso ao website será ininterrupto e sem erros.<br></br><br></br>
                                                    Para além disso, não é responsável por quaisquer danos ou prejuízos resultantes do uso ou incapacidade de uso do website e captação de imagem, incluindo, sem limitação, quaisquer danos diretos, indiretos, incidentais, especiais, consequentes ou punitivos, perda de lucros ou danos similares, mesmo que tenhamos sido informados da possibilidade de tais danos.<br></br><br></br><br></br>

                                                    <span className="type-text1">7.	Política de Privacidade</span><br></br><br></br>
                                                    Ao utilizar o website, o utilizador concorda com a recolha e utilização de informações pessoais e a captação de imagem para fins de partilha e divulgação da Gala do 5º Aniversário do TPP e publicidade da Associação, por parte do TPP.<br></br><br></br><br></br>

                                                    <span className="type-text1">8.	Lei Aplicável e Jurisdição</span><br></br><br></br>
                                                    Os presentes Termos e Condições serão regidos e interpretados de acordo com as leis de Portugal, sem dar efeito a qualquer princípio de conflito de leis. O utilizador concorda que qualquer disputa decorrente ou relacionada com estes Termos e Condições será resolvida exclusivamente pelos tribunais de Portugal.<br></br><br></br><br></br>
                                                    
                                                    <span className="type-text1">9.	Disposições Gerais</span><br></br><br></br>
                                                    Estes Termos e Condições constituem o acordo completo entre o comprador e o Thirst Project Portugal, em relação ao uso do website.<br></br><br></br>
                                                    Se qualquer disposição destes Termos e Condições for considerada inválida ou inexequível por qualquer tribunal competente, as restantes disposições destes Termos e Condições permanecerão em pleno vigor e efeito.<br></br><br></br><br></br>

                                                </p>
                                                <Button
                                                    className="button-modal"
                                                    onClick={acceptTerms}
                                                >
                                                    ACEITO OS TERMOS E CONDIÇÕES
                                                </Button>
                                            </div>
                                        </div>
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