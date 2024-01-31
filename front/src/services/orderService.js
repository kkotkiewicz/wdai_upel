import axios from 'axios';
import { getToken } from './authService';

const orderEndpointUrl = "http://localhost:3000/order"

export async function addNewOrder(userId, orderDetails){
  try{
    const response = await axios.post(`${orderEndpointUrl}`, {
      order_account: userId,
      order_details: orderDetails
    }, {
      headers: {
        Authorization: getToken()
      }
    });
    const { data } = response;
    return data;
  } catch (error) {
    return { success: false, error: "Cannot add a order" };
  }
}

export async function getAllOrders(){
  try{
    const response = await axios.get(`${orderEndpointUrl}`, {
      headers: {
        Authorization: getToken()
      }
    });
    const { data } = response;
    return data;
  } catch (error) {
    return { success: false, error: "Cannot get orders" };
  }
}

export async function getOrderById(orderId){
  try{
    const response = await axios.get(`${orderEndpointUrl}/${orderId}`, {
      headers: {
        Authorization: getToken()
      }
    });
    const { data } = response;
    return data;
  } catch (error) {
    return { success: false, error: "Cannot get order by Id" };
  }
}

export async function getOrdersByUserId(userId){
  try{
    const response = await axios.get(`${orderEndpointUrl}/user/${userId}`, {
      headers: {
        Authorization: getToken()
      }
    });
    const { data } = response;
    return data;
  } catch (error) {
    return { success: false, error: "Cannot get orders for specyfic user" };
  }
}