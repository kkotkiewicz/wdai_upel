import React from 'react';
import '../styles/components/NavigationBar.css';
import logo from '../images/logo.png';
export const NavigationBar = ({activeSite}) => {
    return (
        <div className="navigation-bar">
            <div className="logo" >
                <img src={logo} alt="logo" />
            </div>
            <a href="/" className={activeSite === "HomePage" ? "active" : ""}>Strona główna</a>
            <a href="/courses" className={activeSite === "CoursePage" ? "active" : ""}>Wyszukiwarka</a>
            <a href="/about" className={activeSite === "AboutPage" ? "active" : ""}>Moje kursy</a>
            <div className={"user"}>
                <div className={"user-cart"}>

                </div>
                <div className={"user-avatar"}>
                    <img src="https://www.w3schools.com/howto/img_avatar.png" alt="avatar" />
                </div>
            </div>
        </div>
    );
};