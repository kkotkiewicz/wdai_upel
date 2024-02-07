import React from 'react';
import '../styles/components/NavigationBar.css';
import logo from '../images/logo.png';
import koszyk from '../images/koszyk.png';
import {useNavigate} from "react-router-dom";
import { CiShoppingBasket } from "react-icons/ci";

export const NavigationBar = ({activeSite, openCart}) => {
    const navigate = useNavigate();

    return (
        <div className="navigation-bar">
            <div className="logo">
                <img src={logo} alt="logo"/>
            </div>
            <section className="options">
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
                    <img src={koszyk} alt="koszyk" onClick={openCart}/>
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