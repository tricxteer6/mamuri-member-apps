import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursesPage";
import LoginPage from "./pages/LoginPage";
import MemberDashboard from "./pages/member/MemberDashboard";
import CourseDetailPage from "./pages/member/CourseDetailPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCoursesPage from "./pages/admin/AdminCoursesPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminContentPage from "./pages/admin/AdminContentPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ProfilePage from "./pages/ProfilePage";
import ScrollToTop from "./components/ScrollToTop";

function AppLayout() {
  const location = useLocation();
  const { pathname } = location;
  const hideFooter =
    pathname === "/login" ||
    pathname.startsWith("/member") ||
    pathname.startsWith("/admin");

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:id" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />
          <Route path="/about" element={<Navigate to={{ pathname: "/", hash: "about" }} replace />} />
          <Route path="/contact" element={<Navigate to={{ pathname: "/", hash: "contact" }} replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/account/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/account/password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />
          <Route path="/member" element={<ProtectedRoute role="user"><MemberDashboard /></ProtectedRoute>} />
          <Route path="/member/courses/:id" element={<ProtectedRoute role="user"><CourseDetailPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute role="admin"><AdminCoursesPage /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUsersPage /></ProtectedRoute>} />
          <Route path="/admin/content" element={<ProtectedRoute role="admin"><AdminContentPage /></ProtectedRoute>} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppLayout />
      <Toaster position="top-right" />
    </BrowserRouter>
  );
}
