import{ useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



const Authentication = () => {
  const [name, setName] = useState('');
  const [logEmail, setLogEmail] = useState('');
  const [logPassword, setLogPassword] = useState('');
  const [signEmail, setSignEmail] = useState('');
  const [signPassword, setSignPassword] = useState('');
  const [error, setError] = useState('');
  const [islogin, setIsLogin] = useState(true);
  

  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    
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
  
          localStorage.setItem('user_Id', user.id);  // Store the correct user ID
          navigate('/dashboard');
        } else {
          setError('Invalid password');
        }
      } else {
        setError('Invalid email');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred');
    }
  };
  

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    try {
      // Check if the user already exists
      const response = await axios.get('https://66fd424fc3a184a84d19b66f.mockapi.io/todo/users')
      const users = response.data;
      const user = users.find(user => user.email === signEmail);
      console.log('1');

      if (user) {
        setError('User already exists');
      }else{// Proceed with sign-up if user does not exist
        
        const newUserResponse = await axios.post('https://66fd424fc3a184a84d19b66f.mockapi.io/todo/users', {
          name,
          email: signEmail,
          password: signPassword,
          loginCount: 1,
        });

        const newUser = newUserResponse.data;
        localStorage.setItem('user_Id', newUser.id)
        navigate('/dashboard');
      }
        
      
    } catch (err) {
      console.error(err);
      setError('An error occurred during sign-up');
    }
  };


  return (
    <div>
      {islogin?( 
        // Log In 
        <div>
          <button onClick={()=>setIsLogin(false)}>SignUp</button>
          <h2>Login</h2>

          {error && <h3>{error}</h3>}
          <form onSubmit={handleLogin}>
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
          <button onClick={()=>setIsLogin(true)}>Login</button>
          <h2>Sign Up</h2>

          <form onSubmit={handleSignUp}>
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
