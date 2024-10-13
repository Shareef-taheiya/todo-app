/* eslint-disable react/prop-types */
import  { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState(null);
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState('');

    const fetchUser = useCallback(async (userId) => {
    try {
        const response = await axios.get(`https://66fd424fc3a184a84d19b66f.mockapi.io/todo/users/${userId}`);
        if (response.status === 200) {
        setCurrentUser(response.data);
        } else {
        handleAuthError('User not found');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        handleAuthError('Could not get user data');
    }
    }, []);

    useEffect(() => {
        const storedUserId = localStorage.getItem('user_Id');
        if (storedUserId) {
        fetchUser(storedUserId);
        }
    }, [fetchUser]);

    const fetchTodos = useCallback(async (userId) => {
        try {
          const response = await axios.get(`https://66fd424fc3a184a84d19b66f.mockapi.io/todo/users/${userId}/todos`);
          setTodos(response.data);
        } catch (error) {
          if (error.response && error.response.status === 429) {
            console.error('Too many requests, please try again later.');
          } else {
            console.error('Error fetching todos:', error);
            setError('No todos found');
          }
        }
      }, []);

    const addTodo = async (title, description) => {
        try {
        const response = await axios.post('https://66fd424fc3a184a84d19b66f.mockapi.io/todo/todos', {
            title,
            description,
            status: false,
            userId: currentUser.id,
        });
        setTodos([...todos, response.data]);
        } catch (error) {
        console.error('Error adding todo:', error);
        setError('Failed to add todo');
        }
    };

    const deleteTodo = async (todoId) => {
        try {
        await axios.delete(`https://66fd424fc3a184a84d19b66f.mockapi.io/todo/users/1/todos/${todoId}`);
        setTodos(todos.filter(todo => todo.id !== todoId));
        } catch (error) {
        console.error('Error deleting todo:', error);
        setError('Failed to delete todo');
        }
    };

    const handleLogOut = async () => {
        localStorage.removeItem('user_Id');
        setCurrentUser(null);
    };

    const handleLogin = async (logEmail, logPassword) => {
        setError(''); // Clear previous errors

        try {
            // Fetch the user based on the email
            const response = await axios.get('https://66fd424fc3a184a84d19b66f.mockapi.io/todo/users', {
            params: { email: logEmail },
            });
        
            // Check if the user exists and validate the password manually
            if (response.data.length > 0) {
            const user = response.data[0];
        
            if (user.password === logPassword) {
                const newLoginCount = user.loginCount + 1;
                await axios.put(`https://66fd424fc3a184a84d19b66f.mockapi.io/todo/users/${user.id}`, {
                loginCount: newLoginCount,
                });
        
                localStorage.removeItem('user_Id'); // Clear previous user data
                localStorage.setItem('user_Id', user.id); // Store the correct user ID
                setCurrentUser(user); // Set the new current user immediately
                return 1;
            } else {
                setError('Invalid password');
            }
            } else {
            setError('Invalid email');
            return 2;
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred');
            return 2;
        }
    };
      
    const handleSignUp = async (signEmail,signPassword, name) => {
        setError(''); // Clear previous errors
        try {

        const response = await axios.get('https://66fd424fc3a184a84d19b66f.mockapi.io/todo/users')
        const user = response.data.find(user => user.email === signEmail);
    
        if (user) {
            setError('User already exists');
        } else {
            const newUserResponse = await axios.post('https://66fd424fc3a184a84d19b66f.mockapi.io/todo/users', {
            name,
            email: signEmail,
            password: signPassword,
            loginCount: 1,
            });
    
            const newUser = newUserResponse.data;
            localStorage.setItem('user_Id', newUser.id);
            setCurrentUser(newUser); // Set the new current user
            return 1;
        }
        } catch (err) {
        console.error(err);
        setError('An error occurred during sign-up');
        return 2;
        }
    };
    
    const handleAuthError = (message) => {
        setError(message);
        localStorage.removeItem('user_Id'); 
      };

    return <AuthContext.Provider value={{handleLogOut,handleLogin,handleSignUp,fetchUser, currentUser, setCurrentUser, todos, fetchTodos, addTodo, deleteTodo, error}}>{children}</AuthContext.Provider>;
};