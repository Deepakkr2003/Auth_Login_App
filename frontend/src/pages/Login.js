import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import { handleError, handleSuccess } from '../utils'

function Login() {
    // State for login form data
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    });

    // React Router hook for navigation
    const navigate = useNavigate();

    // Handles changes in form inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        setLoginInfo(prevInfo => ({ ...prevInfo, [name]: value })); // Correct way to update state
    };
    
    // Handles the login form submission
    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;

        // Basic validation
        if (!email || !password) {
            return handleError('email and password are required');
        }

        try {
            const url = `${process.env.REACT_APP_REACT_API}/auth/login`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });

            const result = await response.json();
            const { success, message, jwtToken, name, error } = result;

            if (success) {
                handleSuccess(message);

                // FIX: Correct syntax for localStorage.setItem()
                localStorage.setItem('token', jwtToken); 
                localStorage.setItem('loggedInUser', name);

                // Navigate to the home page after a short delay
                setTimeout(() => {
                    navigate('/home');
                }, 1000);

            } else if (error) {
                const details = error?.details?.[0]?.message;
                handleError(details || 'An unknown error occurred');
            } else {
                handleError(message);
            }
        } catch (err) {
            handleError('Failed to connect to the server.');
            console.error(err);
        }
    };

    return (
        <div className='container'>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor='email'>Email:</label>
                    <input
                        onChange={handleChange}
                        type='email'
                        name='email'
                        placeholder='Enter your email...'
                        value={loginInfo.email}
                    />
                </div>
                <div>
                    <label htmlFor='password'>Password:</label>
                    <input
                        onChange={handleChange}
                        type='password'
                        name='password'
                        placeholder='Enter your password...'
                        value={loginInfo.password}
                    />
                </div>
                <button type='submit'>Login</button>
                <span>Don't have an account? 
                    <Link to="/signup">Signup</Link>
                </span>
            </form>
            <ToastContainer/>
        </div>
    );
}

export default Login;