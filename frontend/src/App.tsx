import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import Dashboard from './pages/dashboard/Dashboard'
function App(){return <Routes><Route path="/" element={<Navigate to="/login" replace/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/forgot-password" element={<ForgotPassword/>}/><Route path="/dashboard" element={<Dashboard/>}/></Routes>}
export default App
