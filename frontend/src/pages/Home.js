import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [products, setProducts] = useState([]); // FIX: Initialize with an empty array
    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Logged out');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    const fetchProducts = async () => {
        try {
            const url = `${process.env.REACT_APP_REACT_API}/products`;
            const headers = {
                'authorization': localStorage.getItem('token')
            };
            const response = await fetch(url, { headers });
            const result = await response.json();
            
            // Log the received products
            console.log(result);
            
            // Check if the response is an array before setting the state
            if (Array.isArray(result)) {
                setProducts(result);
            } else {
                handleError('Products data is not in the expected format.');
            }
        } catch (err) {
            handleError(err);
        }
    };
    
    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div>
            <h1>Welcome, {loggedInUser}!</h1>
            <button onClick={handleLogout}>Logout</button>
            <div>
                <ul>
                    {products.map((item, index) => (
                        <li key={item.name || index}>
                            <span>{item.name}: {item.price}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <ToastContainer/>
        </div>
    );
}

export default Home;