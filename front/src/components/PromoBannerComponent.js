import React, { useState, useEffect } from 'react';
import '../styles/components/PromoBanner.css';

export const PromoBannerComponent = () => {
    // Set the end date for the countdown
    const countdownEndDate = new Date("2024-02-18T00:00:00").getTime();

    // Initialize the countdown state
    const [countdown, setCountdown] = useState({
        hours: '00',
        minutes: '00',
        seconds: '00'
    });

    useEffect(() => {
        // Update the countdown every second
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = countdownEndDate - now;

            // Time calculations for hours, minutes and seconds
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Update the countdown state
            setCountdown({
                hours: hours < 10 ? `0${hours}` : hours.toString(),
                minutes: minutes < 10 ? `0${minutes}` : minutes.toString(),
                seconds: seconds < 10 ? `0${seconds}` : seconds.toString()
            });

            // If the countdown is finished, clear the interval
            if (distance < 0) {
                clearInterval(interval);
                setCountdown({ hours: '00', minutes: '00', seconds: '00' });
            }
        }, 1000);

        // Clean up the interval on component unmount
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="promo-banner">
            <h1>Powiększ swoje kompetencje nawet do 50%<span className="warning">(ostrożnie)</span>!</h1>
            <p>Kursy zapewniające każdą umiejętność – już od 44,99 zł. Promocja kończy się dzisiaj.</p>
            <div className="countdown-timer">
                <span>{countdown.hours}</span>:<span>{countdown.minutes}</span>:<span>{countdown.seconds}</span>
            </div>
        </div>
    );
};
