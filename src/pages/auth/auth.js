import React from 'react'
import {useState} from 'react'
import Login from './login/login'
import Signup from './signup/signup'

const Auth = (props) => {
  const [currentForm, setCurrentForm] =  useState('login');
  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }
  return (
      <>
      <div className='Theme'>
        {currentForm === "login" ? <Login onFormSwitch={toggleForm} /> : <Signup onFormSwitch={toggleForm} />}
      </div>
      </>
    
  )
}

export default Auth