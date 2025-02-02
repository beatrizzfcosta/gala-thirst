import React, { useEffect } from 'react';
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
        <div className="container2">
            <h3 className="text1">
                A SUA DOAÇÃO ESTÁ A MUDAR VIDAS!
            </h3>
            <h3 className="text2">
                Em nome do THIRST PROJECT PORTUGAL,
            </h3>
            <h3 className="text3">
                Obrigado por acreditar na nossa missão!
            </h3>
            <h3 className="text4">
                DAR ÁGUA É DAR VIDA!
            </h3>
            <div className="social-icon-group">
                <a href="https://www.instagram.com/thirstproject_pt" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon
                        icon={faInstagram}
                        size="2x"
                        className='social-icon'
                    />
                </a>
                <a href="https://www.linkedin.com/company/thirstproject-portugal/" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon
                        icon={faLinkedin}
                        size="2x"
                        className='social-icon'
                    />
                </a>
                <a href="https://www.tiktok.com/@thirstproject_pt" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon
                        icon={faTiktok}
                        size="2x"
                        className='social-icon'
                    />
                </a>
                <a href="https://open.spotify.com/user/l6e7xnaz0591vm6cgpmp5j0y2" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon
                        icon={faSpotify}
                        size="2x"
                        className='social-icon'
                    />
                </a>
            </div>
        </div>
    )
}
