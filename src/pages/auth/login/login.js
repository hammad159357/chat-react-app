import React from 'react'
import { useContext, useState } from 'react'
import '../auth.css'
import { notifyError } from '../../../constants/functions'
import { login } from '../../../constants/api/auth'
import { useNavigate } from 'react-router-dom';
import { UserContext } from 'App';


const Login = (props) => {
  const {onFormSwitch} = props
  const {user, setUser} = useContext(UserContext);
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({});
  const isValidEmail = (email) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
    const handleLoginChange = (e)=>{
      setLoginForm(prev =>({...prev,[e.target.name]: e.target.value}))
    }
    const handleLogin = async (e)=>{
      e.preventDefault();
      if( !loginForm?.email || !loginForm?.password ){
        console.log(loginForm?.email)
          notifyError("All Fields are required")
          return;
      }
      if(! isValidEmail(loginForm.email)){
          return notifyError('Please Enter Valid Email')
      }
      login(loginForm).then(data=>{
          if(data?.user && data.user.token){
              localStorage.setItem('user-token', data.user.token);
              setUser(data.user)
              navigate('/chat')
              return
          }
      })
  }
  return (
    <>
    <div className='auth-form-container'>

      <h2>Login</h2>
      <form className='login-form' onSubmit={handleLogin}>
        <label htmlFor="email" >Email</label>
        <input  onChange={handleLoginChange}  placeholder="Email.com" id="email" name="email" />
        <label htmlFor="password" >password</label>
        <input  onChange={ handleLoginChange} type="password" placeholder="******" id="password" name="password" />
        <button style={{marginTop: '20px'}} type='submit'>Log In</button>
      </form>
      <button className='link-btn' onClick={()=> onFormSwitch('register')}>Don't have an account? Register here</button>
    </div>
  </>
  )
}

export default Login