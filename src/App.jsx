import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import Authentication from './Pages/Authentication/Authentication';
import Dashboard from './Pages/Dashboard/Dashboard';
import Todos from './Pages/Todos/Todos';


function App() {
  
  return (

    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Authentication />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/todos" element={<Todos />} />
        </Routes>
      </Router>
    </AuthProvider>

  );
}

export default App;
