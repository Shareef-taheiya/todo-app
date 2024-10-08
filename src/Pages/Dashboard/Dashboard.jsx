import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  return (
  <div>
    <h1>Welcome to the Dashboard</h1>
    <button onClick={()=>navigate('/todos')}>Todo List</button>
  </div>
  );
  
};

export default Dashboard;
