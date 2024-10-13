import{ useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';



const Authentication = () => {

  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [logEmail, setLogEmail] = useState('');
  const [logPassword, setLogPassword] = useState('');
  const [signEmail, setSignEmail] = useState('');
  const [signPassword, setSignPassword] = useState('');
  const [islogin, setIsLogin] = useState(true);

  const { currentUser,error,handleLogin,handleSignUp } = useContext(AuthContext);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const result = await handleLogin(logEmail, logPassword);
    if (result === 1) {
      setInterval(() => {
        navigate('/dashboard');
      }, 2000);
      
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const result = await handleSignUp(signEmail, signPassword, name);
    if (result === 1) {
      navigate('/dashboard');
    }
  };

  return (
    <div>
      {islogin?( 
        // Log In 
        <div>
          <h1>{currentUser? currentUser.name :''}</h1>
          <h1>{currentUser? currentUser.id :''}</h1>
          <button onClick={()=>setIsLogin(false)}>SignUp</button>
          <h2>Login</h2>

          {error && <h3>{error}</h3>}
          <form onSubmit={handleLoginSubmit}>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={logEmail}
                onChange={(e) => setLogEmail(e.target.value)}
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={logPassword}
                onChange={(e) => setLogPassword(e.target.value)}
              />
            </div>
            <button type="submit">Login</button>
          </form>
        </div>
        ):(
          // Sign Up
        <div>
          <h1>{currentUser? currentUser.name :''}</h1>
          <h1>{currentUser? currentUser.id :''}</h1>
          <button onClick={()=>setIsLogin(true)}>Login</button>
          <h2>Sign Up</h2>

          <form onSubmit={handleSignUpSubmit}>
            <div>
              <label>Name:</label>
              <input
                type="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={signEmail}
                onChange={(e) => setSignEmail(e.target.value)}
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={signPassword}
                onChange={(e) => setSignPassword(e.target.value)}
              />
            </div>
            <button type="submit">Sign Up</button>
          </form>
        </div>
        )}
      

      
    </div>
  );
};

export default Authentication;
