import axios from 'axios';

export async function login(user_email, user_password) {
  try{
    const response = await axios.post('http://localhost:3000/user/login', {
      user_email,
      user_password,
    });
    
    const { data } = response;
    if (data.token){
      localStorage.setItem('token', data.token);
      return data.token;
    }
  }
  catch(error){
    return { success: false, error: "Login request failed" };
  }
}

export async function register(user_name, user_lastname, user_email, user_password) {
  try{
    const response = await axios.post('http://localhost:3000/user/register', {
      user_name,
      user_lastname,
      user_email,
      user_password,
    });
    
    const { data } = response;
    return data;
  }
  catch(error){
    return { success: false, error: "Register request failed" };
  }

}

export function logout() {
  localStorage.removeItem('token');
}

export function getToken() {
  return localStorage.getItem('token');
}