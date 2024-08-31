import React, { useState } from 'react';
import axios from 'axios';

const TestComponent = () => {
    const [message, setMessage] = useState('');

    const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/test-flask'); // Hardcoded localhost
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div>
            <button onClick={fetchData}>Test Flask Connection</button>
            <p>{message}</p>
        </div>
    );
};

export default TestComponent;
