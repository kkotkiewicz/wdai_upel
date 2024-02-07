import React from 'react'
import {NavigationBar} from "../components/NavigationBar";
import UserProfile from "../components/UserProfile";
import UserCourses from "../components/UserCourses";

const AboutPage = () => {
    return (
        <div className="background-img">

            <NavigationBar activeSite={"AboutPage"}/>
            <UserProfile/>
            <UserCourses/>

        </div>
    )
}

export default AboutPage