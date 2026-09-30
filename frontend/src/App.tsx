import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ResetPassword from "./pages/auth/ResetPassword";
import ChangePassword from "./pages/auth/ChangePassword";
import Dashboard from "./pages/dashboard/Dashboard";
import Projects from "./pages/projects/Projects";
import ProjectDetails from "./pages/projects/ProjectDetails";
import ProjectMembers from "./pages/projects/ProjectMembers";
import Tasks from "./pages/tasks/Tasks";
import TaskDetails from "./pages/tasks/TaskDetails";
import Notes from "./pages/notes/Notes";
import NoteDetails from "./pages/notes/NoteDetails";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return <Routes>
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/verify-email/:verificationToken" element={<VerifyEmail />} />
    <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:projectId" element={<ProjectDetails />} />
      <Route path="/projects/:projectId/members" element={<ProjectMembers />} />
      <Route path="/projects/:projectId/tasks" element={<Tasks />} />
      <Route path="/projects/:projectId/tasks/:taskId" element={<TaskDetails />} />
      <Route path="/projects/:projectId/notes" element={<Notes />} />
      <Route path="/projects/:projectId/notes/:noteId" element={<NoteDetails />} />
    </Route>
  </Routes>;
}
export default App;
