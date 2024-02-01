import React from 'react';
import '../styles/components/LogoSection.css';
import AT from '../images/AT&T-logo.png'
import Cisco from '../images/Cisco-logo.png'
import Citi from '../images/Citi-logo.jpeg'
import Ericsson from '../images/Ericsson_logo_logo.png'
import PG from '../images/Procter&Gamble-logo.png'
import samsung from '../images/samsung-logo.png'
import HPE from '../images/Hewlett-Packard-Logo.png'

// Add your company logos' URLs here
const logos = [
    { src: samsung, alt: 'Samsung' },
    { src: Cisco, alt: 'Cisco' },
    { src: AT, alt: 'AT&T' },
    { src: PG, alt: 'Procter & Gamble' },
    { src: HPE, alt: 'Hewlett Packard Enterprise' },
    { src: Citi, alt: 'Citi' },
    { src: Ericsson, alt: 'Ericsson' },
    // Add more logo objects as needed
];

export const LogoSectionComponent = () => {
    return (
        <footer className="footer">
            <div className="logo-section">
                <div>Zaufało nam ponad 15 000 firm i miliony użytkowników z całego świata, w tym:</div>
                <div className="logos-container"> {/* This container wraps the logos */}
                    {logos.map((logo, index) => (
                        <div className="logo-container" key={index}>
                            <img src={logo.src} alt={logo.alt} className="company-logo"/>
                        </div>
                    ))}
                </div>
            </div>
        </footer>
    );
};
