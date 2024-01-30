import React from 'react';

export const CourseCard = ({ courseData }) => {
    return (
        <div className="card">
            <img src={courseData.course_photos} alt="picture" />
            <h3>{courseData.course_name}</h3>
            <p>{courseData.course_description}</p>
            <p>{courseData.course_category}</p>
            <p>{courseData.course_price}</p>
        </div>
    );
};
