// UserCourses.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/components/UserCourses.css';

const UserCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:3000/user/${id}`);
                setCourses(response.data); // Assuming the data has a 'courses' field
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <div className="loader">Loading...</div>; // You can replace this with a styled loader

    return (
        <div className="user-courses">
            <h2>User Courses</h2>
            {courses.length > 0 ? (
                <ul>
                    {courses.map(course => (
                        <li key={course._id}>{course.course_name}</li> // Replace '_id' and 'course_name' with your actual field names
                    ))}
                </ul>
            ) : (
                <p>No courses found.</p>
            )}
        </div>
    );
};

export default UserCourses;
