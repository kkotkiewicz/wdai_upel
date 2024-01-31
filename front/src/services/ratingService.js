import axios from 'axios';
import { getToken } from './authService';

const courseEndpointUrl = "http://localhost:3000/course"

export async function addRating(courseId, rating) {
    try {
        const response = await axios.post(`${courseEndpointUrl}/${courseId}/ratings`, {
            rating: rating
        }, {
            headers: {
              Authorization: getToken()
            }
        });
        const { data } = response;
        return data;
    } catch (error) {
        return { success: false, error: "Cannot add a comment" };
    }
}

export async function deleteRating(ratingId, ratingId) {
    try {
        const response = await axios.delete(`${courseEndpointUrl}/${courseId}/ratings/${ratingId}`, {
            headers: {
              Authorization: getToken()
            }
        });
        const { data } = response;
        return data;
    } catch (error) {
        return { success: false, error: "Cannot delete the comment" };
    }
}