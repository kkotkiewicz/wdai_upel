// UserProfile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styles/components/UserProfile.css'; // Załóżmy, że tutaj są Twoje style

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://twoj-backend.com/user/${id}`);
                setUserData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <div className="loader">Ładowanie...</div>; // Tutaj możesz dodać animację ładowania

    return (
        <div className="user-profile">
            {userData ? (
                <>
                    <h2>Profil Użytkownika</h2>
                    <p>Imię: {userData.firstName}</p>
                    <p>Nazwisko: {userData.lastName}</p>
                    <p>Email: {userData.email}</p>
                </>
            ) : (
                <p>Brak danych użytkownika.</p>
            )}
        </div>
    );
};

export default UserProfile;
