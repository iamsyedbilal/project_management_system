import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import Dashboard from './pages/dashboard/Dashboard'
import Projects from './pages/projects/Projects'
import ProjectDetails from './pages/projects/ProjectDetails'
function App(){return <Routes><Route path="/" element={<Navigate to="/login" replace/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/forgot-password" element={<ForgotPassword/>}/><Route path="/dashboard" element={<Dashboard/>}/><Route path="/projects" element={<Projects/>}/><Route path="/projects/:projectId" element={<ProjectDetails/>}/></Routes>}
export default App
