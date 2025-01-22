import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faLinkedin, faTiktok, faSpotify } from '@fortawesome/free-brands-svg-icons';

export default function SummaryDonations() {
    const scrollToTop = () => {
        window.scrollTo(0, 0);
    };

    useEffect(() => {
        scrollToTop();
    }, []);

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Container className="flex flex-col mx-auto text-center mt-10 justify-center" style={{ width: '100%' }}>
                <h3 className="block text-2xl mt-4 font-bold text-thirst-dark-grey">
                    A SUA DOAÇÃO ESTÁ A MUDAR VIDAS!
                </h3>
                <h3 className="block mt-7 text-2xl text-[#17CACE]">
                    Em nome do
                </h3>
                <h3 className="block text-2xl text-[#17CACE]">
                    THIRST PROJECT PORTUGAL,
                </h3>
                <h3 className="block text-2xl mt-6 font-bold text-[#17CACE]">
                    Obrigado por acreditar na nossa missão!
                </h3>
                <h3 className="block text-4xl mt-10 font-bold text-[#17CACE]">
                    DAR ÁGUA É DAR VIDA!
                </h3>
                <div className="mt-10">
                    <a href="https://www.instagram.com/thirstproject_pt" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon
                            icon={faInstagram}
                            style={{ color: '#252a69' }}
                            size="4x"
                            className='me-5 mb-5'
                        />
                    </a>
                    <a href="https://www.linkedin.com/company/thirstproject-portugal/" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon
                            icon={faLinkedin}
                            style={{ color: '#252a69' }}
                            size="4x"
                            className='me-5 mb-5'
                        />
                    </a>
                    <a href="https://www.tiktok.com/@thirstproject_pt" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon
                            icon={faTiktok}
                            style={{ color: '#252a69' }}
                            size="4x"
                            className='me-5 mb-5'
                        />
                    </a>
                    <a href="https://open.spotify.com/user/l6e7xnaz0591vm6cgpmp5j0y2" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon
                            icon={faSpotify}
                            style={{ color: '#252a69' }}
                            size="4x"
                            className='mb-5'
                        />
                    </a>
                </div>
            </Container>
        </div>
    )
}
