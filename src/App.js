import React, { useState, createContext, useLayoutEffect} from 'react';
import './App.css';
import Auth from './pages/auth/auth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GuestMiddleware from './middlewares/guest';
import {userFromToken} from './constants/api/auth'

import {
  BrowserRouter,
  Routes,
  Route  
  } from "react-router-dom";

export const UserContext = createContext({});

function App() {

  const [user, setUser] = useState(null);

  useLayoutEffect(()=>{
    let token = localStorage.getItem('user-token');
    if(token && !user){
      userFromToken(token).then(data=>{
        if(data?.user){
          setUser(data.user);
        }
      })
    }
  }, []);
    return (
      <div className="App">
        <BrowserRouter>
          <Routes>
            {/* <Route path='/chat' element={<AuthMiddleware> <Chat /> </AuthMiddleware>} /> */}
            <Route path='*' element={ <GuestMiddleware><Auth /> </GuestMiddleware> } />
           {/* <Auth />   */}
          </Routes>
        </BrowserRouter>
        <ToastContainer />
      </div>
    );
  }

export default App;
