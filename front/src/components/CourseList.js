import React from 'react';
import {Rating} from './Rating';
import { useNavigate } from 'react-router-dom';
export const CourseList = ({ courseData }) => {
    const navigate = useNavigate();

    return (
        <div className="list-element">
            <div className="list-element-img">
                <img src={courseData.course_photos} alt="picture" />
            </div>
            <div className={"list-element-info"}>
                <h3>{courseData.course_name}</h3>
                <p>{courseData.course_description}</p>
                <p>Kategoria: {courseData.course_category}</p>
                <p>Cena: {courseData.course_price}</p>
                <div className={"list-element-footer"}>
                    <div className={"list-element-rating"}>
                        <Rating averageRating={courseData.rating} />
                    </div>
                    <div className={"list-element-buttons"}>
                        <button className={"list-element-button"} onClick={() => navigate(`/courses/${courseData._id}`)}>Szczegóły</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
