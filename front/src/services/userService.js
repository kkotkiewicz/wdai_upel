import axios from 'axios';
import { getToken } from './authService';

const userEndpointUrl = "http://localhost:3000/user"

export async function getAllUsers() {
    try {
    const response = await axios.get(userEndpointUrl);
    const { data } = response;
    return data;
    } catch (error) {
        return { success: false, error: "Cannot get courses" };
    }
}

export async function getUserById(userId) {
    try {
        const response = await axios.get(`${userEndpointUrl}/${userId}`);
        const { data } = response;
        return data;
    } catch (error) {
        return { success: false, error: "Cannot get user by Id" };
    }
}

export async function getCurrentUser() {
    try {
        const response = await axios.get(`${userEndpointUrl}/current`);
        const { data } = response;
        return data;
    } catch (error) {
        return { success: false, error: "Cannot get current User" };
    }
}

export async function updateUser(userId, user_firstname, user_lastname, user_email, user_photo) {
    try {
        const response = await axios.put(`${userEndpointUrl}/${userId}`, {
            user_firstname: user_firstname,
            user_lastname: user_lastname,
            user_email: user_email,
            user_photo: user_photo
        }, {
            headers: {
              Authorization: getToken()
            }
        });
        const { data } = response;
        return data;
    } catch (error) {
        return { success: false, error: "Cannot update the user" };
    }
}

export async function deleteUser(userId) {
    try {
        const response = await axios.delete(`${userEndpointUrl}/${userId}`, {
            headers: {
              Authorization: getToken()
            }
        });
        const { data } = response;
        return data;
    } catch (error) {
        return { success: false, error: "Cannot delete the user" };
    }
}