import React, { useEffect, useState } from 'react';
import {useNavigate} from "react-router-dom";
import { getAllCourses } from "../services/courseService"
import '../styles/components/CoursesTable.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import courseImage1 from '../images/course1.png';

export const CoursesTableComponent = () => {
    
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);

    useEffect(() => {
        getAllCourses().then(data => {setCourses(data)}).catch(error => console.error(error))
    }, [])

    const settings = {
        dots: true,
        infinite: true,
        speed: 2000,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    if (courses.length === 0) {
        return null;
    }
    else {
        return (
            <div className="courses-table">
                <Slider {...settings}>
                    {courses.map(course => (
                        <div className="course-card" key={course.id}>
                            <img src={course.course_photos.length !== 0 ? course.course_photos[0] : courseImage1} alt={course.course_name} className="course-image" />
                            {course.bestseller && <span className="bestseller-label">Bestseller</span>}
                            <h3>{course.course_name}</h3>
                            <p className="instructor">{course.course_instructor}</p>
                            <div className="course-rating">
                                {Array.from({ length: Math.round(course.rating) }, (_, i) => (
                                    <span key={i} className="star">★</span>
                                ))}
                                <span className="reviews">({course.ratings.length})</span>
                            </div>
                            <div className="course-price">
                                <span className="current-price">{course.course_price}</span>
                                <span className="original-price">{course.course_price + 200}</span>
                            </div>
                            <button onClick={() => navigate(`/courses/${course._id}`)}>Zobacz</button>
                        </div>
                    ))}
                </Slider>
            </div>
        );
    }
};