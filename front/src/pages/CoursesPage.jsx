import React, {useEffect, useState} from 'react';
import '../styles/pages/CoursesPage.css';
import '../styles/components/CourseList.css';
import { CourseList } from '../components/CourseList';
import { NavigationBar } from '../components/NavigationBar';
import shoppingCart from "../components/ShoppingCart";
import ShoppingCart from "../components/ShoppingCart";

function Courses() {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [lowerPriceFilter, setLowerPriceFilter] = useState(0);
    const [higherPriceFilter, setHigherPriceFilter] = useState(999);
    const [ratingFilter, setRatingFilter] = useState(0);
    const [shoppingCart, setShoppingCart] = useState([]);
    const [cart, setOpenCart] = useState(false);

    const fetchCourses = () => {
        fetch('http://localhost:3000/course')
            .then(response => response.json())
            .then(data => setCourses(data))
            .catch(err => console.error(err))
    }
    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        setFilteredCourses(courses);
    }, [courses]);

    const handleAddToCart = (course) => {
        setShoppingCart([...shoppingCart, course]);
    };
    const handleRemoveFromCart = (course) => {
        const newShoppingCart = shoppingCart.filter(cartCourse => cartCourse.id !== course.id);
        setShoppingCart(newShoppingCart);
    }
    const openFilters = () => {
        setShowFilters(true);
    };
    const closeFilters = () => {
        setShowFilters(false);
    };
    const openCart = () => {
        setOpenCart(true);
    };
    const closeCart = () => {
        setOpenCart(false);
    };
    // modify this code to make filters work only when button is pressed
    const applyFilters = () => {
        const newFilteredCourses = courses.filter(course => {
            const searched = course.course_name.toLowerCase().includes(search.toLowerCase());
            const categoryFilter = filter ? course.course_category === filter : true;
            const priceFilter = course.course_price >= lowerPriceFilter && course.course_price <= higherPriceFilter;
            return searched && categoryFilter && priceFilter;
        });
        setFilteredCourses(newFilteredCourses);
        closeFilters();
    };
    const handleSearch = (e) => {
        if(e.target.value === "") {
            setSearch("");
            setFilteredCourses(courses);
        } else {
            setSearch(e.target.value);
            const searchedCourses = courses.filter(course => course.course_name.toLowerCase().includes(search.toLowerCase()));
            setFilteredCourses(searchedCourses);
        }
    }

    return (
        <>
            <div className="background-img" />
            <NavigationBar activeSite={"CoursePage"} openCart={openCart}/>
            <div className="Courses">
                <div className="search-bar">
                    <p> Wyszukaj: </p>
                    <input type="text" value={search} onChange={(e) => handleSearch(e)}/>
                    <button className={"filter-button"} onClick={openFilters}> Filtry </button>
                    {showFilters && (
                        <div className={"filters"}>
                            <h1>FILTRUJ</h1>
                            <div className={"category-filter"}>
                                <p> Wybierz kategorię: </p>
                                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                                    <option value="">Wszystkie kategorie</option>
                                    <option value="Informatyka">Informatyka</option>
                                    <option value="Psychologia">Psychologia</option>
                                    <option value="Kulinaria">Kulinaria</option>
                                    <option value="Języki">Języki</option>
                                    <option value="Sztuka">Sztuka</option>
                                    <option value="Finanse">Finanse</option>
                                    <option value="Fotografia">Fotografia</option>
                                    <option value="Matematyka">Matematyka</option>
                                    <option value="Design">Design</option>
                                </select>
                            </div>
                            <p> Wybierz przedział cenowy:</p>
                            <div className={"price-filter"}>
                                <p> Min: </p>
                                <input type={"number"} value={lowerPriceFilter} onChange={(e) => setLowerPriceFilter(e.target.value)}/>
                                <p> Max: </p>
                                <input type={"number"} value={higherPriceFilter} onChange={(e) => setHigherPriceFilter(e.target.value)} />
                            </div>
                            <p> Wybierz ocenę kursu: </p>
                            <div className={"rating-filter"}>

                            </div>

                            <button onClick={applyFilters}> ZASTOSUJ </button>
                        </div>
                    )}
                </div>
                <div className={"list-wrapper"}>
                    {filteredCourses.map(course => (
                        <CourseList key={course.id} courseData={course} addToCart={handleAddToCart}/>
                    ))}
                </div>
                {cart && (
                    <ShoppingCart shoppingCart={shoppingCart} closeCart={closeCart} deleteFromCart={handleRemoveFromCart}/>
                )}
            </div>
        </>
    );
}

export default Courses;