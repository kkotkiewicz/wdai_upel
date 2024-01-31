import React from 'react';
import '../styles/components/CoursesTable.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import courseImage1 from '../images/course1.png';
import courseImage2 from '../images/course2.jpg';
import courseImage3 from '../images/course3.jpg';
import courseImage4 from '../images/python4.png';
import courseImage5 from '../images/python5.jpeg';
import courseImage6 from '../images/python6.jpg';
import courseImage7 from '../images/python7.jpg';
import courseImage8 from '../images/python8.jpg';
// ... Import other course images

const courses = [
    {
        id: 1,
        title: 'Python 3 od Podstaw do Eksperta',
        instructor: 'Arkadiusz Włodarczyk',
        rating: 4.7,
        reviews: 5508,
        price: '44,99 zł',
        originalPrice: '299,99 zł',
        image: courseImage1,
        bestseller: true,
    },
    {
        id: 2,
        title: 'Python dla początkujących',
        instructor: 'Rafał Mobilio',
        rating: 4.7,
        reviews: 5737,
        price: '44,99 zł',
        originalPrice: '219,99 zł',
        image: courseImage2,
        bestseller: false,
    },
    {
        id: 3,
        title: '[2024] Kurs Python 3 od podstaw',
        instructor: 'Kuba Wąsikowski',
        rating: 4.6,
        reviews: 551,
        price: '44,99 zł',
        originalPrice: '239,99 zł',
        image: courseImage3, // You need to import this image at the top of your file
        bestseller: false,
    },
    {
        id: 4,
        title: 'Kurs Python w Pigulce od Podstaw do Mastera',
        instructor: 'EduTago',
        rating: 4.8,
        reviews: 74,
        price: '44,99 zł',
        originalPrice: '199,99 zł',
        image: courseImage4, // You need to import this image at the top of your file
        bestseller: false,
    },
    {
        id: 5,
        title: 'Zaawansowany Python w Praktyce',
        instructor: 'Aneta Mikulik',
        rating: 4.9,
        reviews: 890,
        price: '54,99 zł',
        originalPrice: '279,99 zł',
        image: courseImage5, // You need to import this image at the top of your file
        bestseller: true,
    },
    {
        id: 6,
        title: 'Python i Big Data - Analiza Danych',
        instructor: 'Piotr Banasik',
        rating: 4.5,
        reviews: 322,
        price: '59,99 zł',
        originalPrice: '319,99 zł',
        image: courseImage6, // You need to import this image at the top of your file
        bestseller: false,
    },
    {
        id: 7,
        title: 'Python dla Nauki i Sztucznej Inteligencji',
        instructor: 'Olga Horbacz',
        rating: 4.7,
        reviews: 1050,
        price: '49,99 zł',
        originalPrice: '259,99 zł',
        image: courseImage7, // You need to import this image at the top of your file
        bestseller: true,
    },
    {
        id: 8,
        title: 'Web Scraping z Pythonem - Kompletny Kurs',
        instructor: 'Tomasz Dobosz',
        rating: 4.8,
        reviews: 678,
        price: '39,99 zł',
        originalPrice: '219,99 zł',
        image: courseImage8, // You need to import this image at the top of your file
        bestseller: false,
    }
];

export const CoursesTableComponent = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 2000,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000, // Autoplay speed set to 10 seconds
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

    return (
        <div className="courses-table">
            <Slider {...settings}>
                {courses.map(course => (
                    <div className="course-card" key={course.id}>
                        <img src={course.image} alt={course.title} className="course-image" />
                        {course.bestseller && <span className="bestseller-label">Bestseller</span>}
                        <h3>{course.title}</h3>
                        <p className="instructor">{course.instructor}</p>
                        <div className="course-rating">
                            {Array.from({ length: Math.round(course.rating) }, (_, i) => (
                                <span key={i} className="star">★</span>
                            ))}
                            <span className="reviews">({course.reviews})</span>
                        </div>
                        <div className="course-price">
                            <span className="current-price">{course.price}</span>
                            <span className="original-price">{course.originalPrice}</span>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};