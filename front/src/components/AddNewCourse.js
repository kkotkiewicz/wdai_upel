// AddNewCourse.js
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/components/AddNewCourse.css'; // Import the CSS file for styling

const AddNewCourse = () => {
    const [courseData, setCourseData] = useState({
        course_name: '',
        course_instructor: '',
        course_description: '',
        // course_photos: [],
        course_category: '',
        course_price: ''
    });
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleChange = (e) => {
        if(e.target.name === 'course_photos') {
            setCourseData({ ...courseData, course_photos: e.target.files });
        } else {
            setCourseData({ ...courseData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/course', courseData);
            setMessage('Course successfully added!');
            setIsError(false);
            setCourseData({
                course_name: '',
                course_instructor: '',
                course_description: '',
                course_photos: [],
                course_category: '',
                course_price: ''
            });
        } catch (error) {
            setMessage('Error adding course. Please try again.');
            setIsError(true);
        }
    };

    return (
        <div className="add-course-form">

            <h2>Add New Course</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="course_name"
                    placeholder="Course Name"
                    value={courseData.course_name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="course_instructor"
                    placeholder="Course Instructor"
                    value={courseData.course_instructor}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="course_description"
                    placeholder="Course Description"
                    value={courseData.course_description}
                    onChange={handleChange}
                    required
                />
                {/*<input*/}
                {/*    type="file"*/}
                {/*    name="course_photos"*/}
                {/*    onChange={handleChange}*/}
                {/*    multiple*/}
                {/*/>*/}
                <input
                    type="text"
                    name="course_category"
                    placeholder="Course Category"
                    value={courseData.course_category}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="course_price"
                    placeholder="Course Price"
                    value={courseData.course_price}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Add Course</button>
            </form>
            {message && <div className={isError ? "error-message" : "success-message"}>{message}</div>}
        </div>
    );
};

export default AddNewCourse;
