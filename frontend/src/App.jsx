import React from 'react'
import Home from './pages/Home'
import { Routes, Route } from "react-router-dom";
import SignIn from './pages/SignIn';
import SignUp from './pages/signup';
import Users from './pages/Users';
import CodeVerification from './pages/CodeVerification';

const ROLES = {
  ADMIN: "admin",
  USER: "user",
}

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/signin' element={<SignIn />} />
      <Route path='/users' element={<Users />} />
      <Route path='/verify' element={<CodeVerification/>}/>
    </Routes>
  )
}

export default App