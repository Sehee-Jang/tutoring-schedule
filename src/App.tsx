import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppContent from "./components/layout/AppContent";
import AdminPage from "./pages/admin/page";
import AdminRoute from "./components/common/AdminRoute";
import TutorPage from "./pages/tutor/page";
import ModalRenderer from "./components/shared/ModalRenderer";
import Providers from "./Providers";
import CreateAdminPage from "./pages/admin/createAdmin";
import LoginPage from "./components/auth/LoginPage";

const App: React.FC = () => {
  return (
    <Providers>
      <Router>
        <Routes>
          <Route path='/' element={<AppContent />} />
          <Route path='/login' element={<LoginPage />} />
          <Route
            path='/admin'
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
          <Route path='/tutor' element={<TutorPage />} />
          <Route path='/admin/signup' element={<CreateAdminPage />} />
        </Routes>
        <ModalRenderer />
      </Router>
    </Providers>
  );
};

export default App;
