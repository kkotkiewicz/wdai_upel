import React, {useEffect, useState} from 'react';
import '../styles/pages/CoursesPage.css';
import '../styles/components/CourseList.css';
import { CourseList } from '../components/CourseList';
import { NavigationBar } from '../components/NavigationBar';
import { getAllCourses } from "../services/courseService"

function Courses() {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [lowerPriceFilter, setLowerPriceFilter] = useState(0);
    const [higherPriceFilter, setHigherPriceFilter] = useState(999);

    useEffect(() => {
        getAllCourses().then(data => {
            setCourses(data)
        })
    }, []);

    useEffect(() => {
        setFilteredCourses(courses);
    }, [courses]);

    const openFilters = () => {
        setShowFilters(true);
    };
    const closeFilters = () => {
        setShowFilters(false);
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


    return (
        <>
            <div className="background-img" />
            <NavigationBar activeSite={"CoursePage"} />
            <div className="Courses">
                <div className="search-bar">
                    <p> Wyszukaj: </p>
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}/>
                    <button className={"filter-button"} onClick={openFilters}> Filtry </button>
                    {showFilters && (
                        <div className={"filters"}>
                            <h1>FILTRUJ</h1>
                            <div className={"category-filter"}>
                                <p> Wybierz kategorię: </p>
                                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                                    <option value="">Wszystkie kategorie</option>
                                    <option value="Programming">Programming</option>
                                    <option value="category2">Kategoria 2</option>
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
                        <CourseList key={course.id} courseData={course} />
                    ))}
                </div>
                <div className={"pages"}>

                </div>
            </div>
        </>
    );
}

export default Courses;