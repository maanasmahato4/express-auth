import React from 'react'
import Home from './pages/Home'
import { Routes, Route } from "react-router-dom";
import SignIn from './pages/SignIn';
import SignUp from './pages/signup';
import Users from './pages/Users';
import CodeVerification from './pages/CodeVerification';
import ChangePassword from './pages/ChangePassword';
import RenewPassword from './pages/RenewPassword';
import UserProfile from './components/user';
import { ProtectedRoute } from "./components/protectedRoute";

const ROLES = {
  ADMIN: "admin",
  USER: "user",
}

function App() {
  return (
    <Routes>
      <Route path='/' element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      } />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/signin' element={<SignIn />} />
      <Route path='/users' element={
        <ProtectedRoute>
          <Users />
        </ProtectedRoute>
      } />
      <Route path='/verify' element={<CodeVerification />} />
      <Route path='/change-password' element={
        <ProtectedRoute>
          <ChangePassword />
        </ProtectedRoute>
      } />
      <Route path='/renew-password' element={<RenewPassword />} />
      <Route path='/user' element={
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App