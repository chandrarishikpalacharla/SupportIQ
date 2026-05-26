import { Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "../pages/LoginPage"
import DashboardPage from "../pages/DashboardPage"
import UploadPage from "../pages/UploadPage"
import ChatPage from "../pages/ChatPage"
import SettingsPage from "../pages/SettingsPage"
import ProtectedRoute from "./ProtectedRoute"
import { ROUTES } from "../utils/constants"

const AppRoutes = () => (
  <Routes>
    <Route path={ROUTES.LOGIN} element={<LoginPage/>}/>
    <Route path={ROUTES.DASHBOARD} element={
      <ProtectedRoute><DashboardPage/></ProtectedRoute>
    }/>
    <Route path={ROUTES.UPLOAD} element={
      <ProtectedRoute><UploadPage/></ProtectedRoute>
    }/>
    <Route path={ROUTES.CHAT} element={
      <ProtectedRoute><ChatPage/></ProtectedRoute>
    }/>
    <Route path={ROUTES.SETTINGS} element={
      <ProtectedRoute><SettingsPage/></ProtectedRoute>
    }/>
    <Route path="/" element={<Navigate to={ROUTES.LOGIN}/>}/>
    <Route path="*" element={<Navigate to={ROUTES.LOGIN}/>}/>
  </Routes>
)

export default AppRoutes
