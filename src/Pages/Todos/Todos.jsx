import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const TodoList = () => {
  
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('')
  const [currentUser, setCurrentUser] = useState(null)

  // Fetch user info from the API on component mount 
  useEffect(() => {

    const getUser = async () =>{
        try {
            const storedUserId = localStorage.getItem('user_Id');
            if (storedUserId) {
                setUserId(storedUserId);
                const response = await axios.get(`https://66fd424fc3a184a84d19b66f.mockapi.io/todo/users/${storedUserId}`);
                setCurrentUser(response.data);
            }
          } catch (error) {
            console.error('Error getting user data:', error);
            setError('Could not get user data');
          }
    }

    getUser();

  },[]);

  // Fetch todos from the API on component mount 
  useEffect(() => {

    const fetchTodos = async () => {
      if(userId){

         try {

          const response = await axios.get(`https://66fd424fc3a184a84d19b66f.mockapi.io/todo//users/${userId}/todos`)

        // Check if response has data or not
         if (response.data.length > 0) {
          const todos = response.data.filter(todo => todo.userId === userId);  // Filter todos based on user ID
          setTodos(todos);
         } else {
          setTodos([]);
          setError('No todos found');
         }

      } catch (error) {
        // Check if it's a 404 error
        if (error.response && error.response.status === 404) {
          // Handle the 404 case, assume no todos
          setTodos([]);
          setError('No todos found');
        } else {
          console.error('Error fetching todos:', error);
          setError('Could not fetch todos');
        }
      } 
      }
      
  };

    fetchTodos();

  }, [userId]);

  // Handle adding a new todo
  const addTodo = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://66fd424fc3a184a84d19b66f.mockapi.io/todo/todos', {
        title,
        description,
        status: false,  // Default to incomplete
        userId:userId
      });
      setTodos([...todos, response.data]);  // Add new todo to state
      setTitle('');  // Clear the input fields
      setDescription('');
    } catch (error) {
      console.error('Error adding todo:', error);
      setError('Failed to add todo');
    }
  };

  const deleteTodo = async (todoId) => {
    try {
      // Ensure the todo exists in the list before trying to delete it
      const todoToDelete = todos.find(todo => todo.id === todoId);
      if (todoToDelete) {
        const todoId = String(todoToDelete.id); // Ensure ID is a string
        console.log(`Deleting todo with id: ${todoId}`);
  
        // Ensure the request URL is correctly formed
        
        await axios.delete(`https://66fd424fc3a184a84d19b66f.mockapi.io/todo/users/1/todos/${todoId}`);

        
        // Remove the deleted todo from the state
        setTodos(todos.filter(todo => todo.id !== todoId));
      } else {
        console.error('Todo not found in the current list');
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('Failed to delete todo');
    }
  };
  

  return (
    <div>
      {currentUser && <p>{currentUser.id}</p>}
      {currentUser && <p>{currentUser.loginCount}</p>}
      {currentUser && <p>{`Welcome ${currentUser.loginCount>2 ? 'back':''} ${currentUser.name}`}</p>}
      <h2>Todo List</h2>

      {/* Form to add new todo */}
      <form onSubmit={addTodo}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit">Add Todo</button>
      </form>

      {error && <p>{error}</p>}


      {/* Display the todo list */}
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <h3>{todo.title}</h3>
            <p>{todo.description}</p>
            <p>Status: {todo.status ? 'Completed' : 'Pending'}</p>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>

       <button onClick={() => {
        localStorage.removeItem('user_Id');
        navigate('/');
        }}>Log Out</button>
        
        
    </div>
  );
};

export default TodoList;
