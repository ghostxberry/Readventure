import { useState, useEffect } from 'react';
import AppContext from "./AppContext";

const AppProvider = ({ children }) => {

    const [session, setSession] = useState(null);

    useEffect(() => {
        const storedSession = localStorage.getItem('session');
        if (storedSession) {
            setSession(JSON.parse(storedSession));
        }
    }, []);

    useEffect (() => {
        if (session) {
            localStorage.setItem('session', JSON.stringify(session))
        }
        else {
        localStorage.removeItem('session')
        }
        
    }, [session]);

    // useEffect(() => {
    //     const fetchUserData = async () => {
    //         // Fetch user data from the backend upon login
    //         if (session && session.loggedIn) {
    //             try {
    //                 const apiURL = `${import.meta.env.VITE_API_URL}/me`;
    //                 const response = await fetch(apiURL, { // Corrected placement of parentheses
    //                     method: 'GET',
    //                     headers: {
    //                         'Authorization': `Bearer ${session.user_id}` // Include token for authentication
    //                     }
    //                 });
    //                 if (response.ok) {
    //                     const userData = await response.json();
    //                     // Merge user data with existing session data
    //                     setSession(prevSession => ({
    //                         ...prevSession,
    //                         id: userData.id,
    //                     }));
    //                 } else {
    //                     // Handle error response from backend
    //                     console.error('Error fetching user data:', response.statusText);
    //                 }
    //             } catch (error) {
    //                 console.error('Error fetching user data:', error);
    //             }
    //         }
    //     };
    
    //     fetchUserData();
    // }, [session, setSession]);
    

    return (
        <AppContext.Provider value={{ session, setSession }}>
            {children}
        </AppContext.Provider>
    )
}

export default AppProvider;