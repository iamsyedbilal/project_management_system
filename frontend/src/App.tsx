import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<div className="page"><h1>Login</h1></div>} />
      <Route path="/register" element={<div className="page"><h1>Register</h1></div>} />
    </Routes>
  )
}

export default App
