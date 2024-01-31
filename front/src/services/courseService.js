import axios from 'axios';
import { getToken } from './authService';

const courseEndpointUrl = "http://localhost:3000/course"

export async function getAllCourses() {
    try {
    const response = await axios.get(courseEndpointUrl);
    const { data } = response;
    return data;
    } catch (error) {
        return { success: false, error: "Cannot get courses" };
    }
}

export async function getCourseById(courseId) {
    try {
        const response = await axios.get(`${courseEndpointUrl}/${courseId}`);
        const { data } = response;
        return data;
    } catch (error) {
        return { success: false, error: "Cannot get course by Id" };
    }
}

export async function addNewCourse(course_name, course_description, course_photos, course_category, course_price) {
    try {
        const response = await axios.post(`${courseEndpointUrl}`, {
            course_name: course_name,
            course_description: course_description,
            course_photos: course_photos,
            course_category: course_category,
            course_price: course_price
        }, {
            headers: {
              Authorization: getToken()
            }
        });
        const { data } = response;
        return data;
    } catch (error) {
        return { success: false, error: "Cannot create a course" };
    }
}

export async function updateCourse(courseId, course_name, course_description, course_photos, course_category, course_price) {
    try {
        const response = await axios.put(`${courseEndpointUrl}/${courseId}`, {
            course_name: course_name,
            course_description: course_description,
            course_photos: course_photos,
            course_category: course_category,
            course_price: course_price
        }, {
            headers: {
              Authorization: getToken()
            }
        });
        const { data } = response;
        return data;
    } catch (error) {
        return { success: false, error: "Cannot update the course" };
    }
}

export async function deleteCourse(courseId) {
    try {
        const response = await axios.delete(`${courseEndpointUrl}/${courseId}`, {
            headers: {
              Authorization: getToken()
            }
        });
        const { data } = response;
        return data;
    } catch (error) {
        return { success: false, error: "Cannot delete the course" };
    }
}