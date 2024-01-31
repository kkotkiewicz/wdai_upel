import axios from 'axios';
import { getToken } from './authService';

const courseEndpointUrl = "http://localhost:3000/course"

export async function addNewComment(courseId, comment_text) {
    try {
        const response = await axios.post(`${courseEndpointUrl}/${courseId}/comments`, {
            text: comment_text
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

export async function updateComment(courseId, commentId, comment_text) {
    try {
        const response = await axios.put(`${courseEndpointUrl}/${courseId}/comments/${commentId}`, {
            text: comment_text
        }, {
            headers: {
              Authorization: getToken()
            }
        });
        const { data } = response;
        return data;
    } catch (error) {
        return { success: false, error: "Cannot update the comment" };
    }
}

export async function deleteComment(courseId, commentId) {
    try {
        const response = await axios.delete(`${courseEndpointUrl}/${courseId}/comments/${commentId}`, {
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