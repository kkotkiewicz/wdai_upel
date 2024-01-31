import React from 'react'
import {NavigationBar} from "../components/NavigationBar";
import {PromoBannerComponent} from "../components/PromoBannerComponent";
import {LogoSectionComponent} from "../components/LogoSectionComponent";
import {CoursesTableComponent} from "../components/CoursesTableComponent";
import "../styles/pages/HomePage.css"

const HomePage = () => {
    return (
        <div className="background-img">

            <div className="scrollable-container">
                <NavigationBar activeSite={"HomePage"}/>
                <PromoBannerComponent/>
                <div className=".main-content"><CoursesTableComponent/></div>
                <LogoSectionComponent/>
            </div>


        </div>
    )
}

export default HomePage