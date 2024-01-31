import React from 'react';
import '../styles/components/NavigationBar.css';
import logo from '../images/logo.png';
import {useNavigate} from "react-router-dom";

export const NavigationBar = ({activeSite}) => {
    const navigate = useNavigate();

    return (
        <div className="navigation-bar">
            <section className="options">
                <div className="logo">
                    <img src={logo} alt="logo"/>
                </div>
                <div className={activeSite === "HomePage" ? "active" : ""} onClick={() => navigate("/")}> Strona Główna
                </div>
                <div className={activeSite === "CoursePage" ? "active" : ""}
                     onClick={() => navigate("/courses")}> Wyszukiwarka
                </div>
                <div className={activeSite === "AboutPage" ? "active" : ""} onClick={() => navigate("/about")}> Moje
                    Kursy
                </div>
            </section>

            <div className={"user"}>
                <div id={"user-cart"}>

                </div>
                <div className={"user-avatar"}>
                    <div className={activeSite === "UserPage" ? "active" : ""} onClick={() => navigate("/user")}><img
                        src="https://www.w3schools.com/howto/img_avatar.png" alt="avatar"/>
                    </div>
                </div>
            </div>
        </div>
    );
};