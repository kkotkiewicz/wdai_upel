import axios from 'axios';
import { getToken } from './authService';

const courseEndpointUrl = "http://localhost:3000/course"
const photoEnpointUrl = "http://localhost:3000/upload/"

export async function addPhotoToCourse(courseId, formData) {
    try {
        axios.post(photoEnpointUrl, formData).then(async photoResponse => {
            const response = await axios.post(`${courseEndpointUrl}/${courseId}/photos`, {
                photo_url: photoResponse.data
            }, {
                headers: {
                  Authorization: getToken()
                }
            });
            const { data } = response;
            return data;
        }).catch(error => {return { success: false, error: "Cannot add a photo" }})
        
    } catch (error) {
        return { success: false, error: "Cannot add a photo" };
    }
}
