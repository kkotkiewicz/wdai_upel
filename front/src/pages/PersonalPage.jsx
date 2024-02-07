import React from 'react'
import {NavigationBar} from "../components/NavigationBar";
import AddNewCourse from "../components/AddNewCourse";

const PersonalPage = () => {
    return (
        <div className="background-img">
            <NavigationBar activeSite={"UserPage"}/>
            <AddNewCourse/>


        </div>
    )
}

export default PersonalPage