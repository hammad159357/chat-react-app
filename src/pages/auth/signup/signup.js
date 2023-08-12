import React from 'react'
import { useState,useContext } from 'react';
import '../auth.css'
import { notifyError } from '../../../constants/functions'
import { useNavigate } from 'react-router-dom';
import { register } from '../../../constants/api/auth'
import { UserContext } from 'App';




const Register = (props) => {
    const {onFormSwitch} = props
    const {user, setUser} = useContext(UserContext);

    const navigate = useNavigate();
    const [registerForm, setRegisterForm] = useState({});
    const isValidEmail = (email) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)

    const onSignupChange=(e)=>{
        setRegisterForm(prev => ({...prev,[e.target.name]:e.target.value}))
    }

    const handleRegister = async (e)=>{
        e.preventDefault();
        if( !registerForm?.name || !registerForm?.email || !registerForm?.password ){
            notifyError("All Fields are required")
            return;
        }
        if(! isValidEmail(registerForm.email)){
            return notifyError('Please Enter Valid Email')
        }
        register(registerForm).then(data=>{
            if(data?.user && data.user.token){
                localStorage.setItem('user-token', data.user.token);
                setUser(data.user)
                navigate('/chat')
                return
            }
        })
    }
  return (
    <><div className='auth-form-container'>
      <h2>Register</h2>
    <form className='login-form' onSubmit={handleRegister}>
        <label htmlFor='name'>Full Name</label>
        <input onChange={onSignupChange} name="name" id="name" placeholder='full name' />

        <label htmlFor="email" >Email</label>
        <input onChange={onSignupChange} placeholder="Email.com" id="email" name="email" />
        <label htmlFor="password" >password</label>
        <input onChange={onSignupChange} type="password" placeholder="******" id="password" name="password" />
        <button style={{marginTop: '20px'}} type='submit'>Register</button>
    </form>
    <button className='link-btn' onClick={()=> onFormSwitch('login')}>Already have an account? Login here</button>
  </div>
  </>
  )
}

export default Register