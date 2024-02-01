import React from 'react';
import {Rating} from './Rating';
export const CourseList = ({ courseData }) => {
    return (
        <div className="list-element">
            <div className="list-element-img">
                <img src={courseData.course_photos} alt="picture" />
            </div>
            <div className={"list-element-wrapper"}>
                <div className={"list-element-info"}>
                    <h3>{courseData.course_name}</h3>
                    <p>{courseData.course_description}</p>
                    <p>Kategoria: {courseData.course_category}</p>
                    <p>Cena: {courseData.course_price}</p>
                </div>
                <div className={"list-element-footer"}>
                    <div className={"list-element-rating"}>
                        <Rating averageRating={courseData.rating_avg} />
                    </div>
                    <div className={"list-element-buttons"}>
                        <button className={"list-element-button"}>Szczegóły</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
