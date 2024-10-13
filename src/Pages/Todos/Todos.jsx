import { useContext, useEffect } from 'react';
import { AuthContext } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';

const TodoList = () => {
  const { currentUser, todos, error, fetchTodos, addTodo, deleteTodo,handleLogOut } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {

    if (currentUser) {
      fetchTodos(currentUser.id);
    }
  }, [currentUser, fetchTodos]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    const description = e.target.description.value;
    addTodo(title, description);
    e.target.reset();
  };

  return (
    <div>
      {currentUser && <p>{`Welcome ${currentUser.name}`}</p>}
      <h2>Todo List</h2>
      <form onSubmit={handleAddTodo}>
        <div>
          <label>Title:</label>
          <input type="text" name="title" />
        </div>
        <div>
          <label>Description:</label>
          <input type="text" name="description" />
        </div>
        <button type="submit">Add Todo</button>
      </form>
      {error && <p>{error}</p>}
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
        handleLogOut()
        navigate('/');
      }}>Log Out</button>
    </div>
  );
};

export default TodoList;