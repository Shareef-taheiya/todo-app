import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import { useContext } from 'react';

const Dashboard = () => {

  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
  <div>
    <h1>Welcome to the Dashboard name:{currentUser? currentUser.name :''} id: {currentUser? currentUser.id :''}</h1>
    <button onClick={()=>navigate('/todos')}>Todo List</button>
  </div>
  );
  
};

export default Dashboard;
