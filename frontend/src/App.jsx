import { Routes, Route } from "react-router-dom";


import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";
import RegisterSuccessPage from "./pages/auth/RegisterSuccess";


import DashboardPage from "./pages/dashboard/AdminDashboard";
import AnalyticsPage from "./pages/analytics/AnalyticsDashboard";


import DronesPage from "./pages/drones/DronesList";
import DroneDetailsPage from "./pages/drones/DroneDetails";
import AssignDronePage from "./pages/drones/AssignDrone";
import AddDronePage from "./pages/drones/AddDrone";
import DroneCreatedPage from "./pages/drones/DroneCreated";


import ReportsPage from "./pages/reports/ReportsList";
import ReportDetailsPage from "./pages/reports/ReportDetails";
import SubmitReportPage from "./pages/reports/SubmitReport";
import SubmitSuccessPage from "./pages/reports/SubmitSuccess";


import UsersList from "./pages/users/UsersList";
import AdminProfileManagement from "./pages/users/AdminProfileManagement"; 


import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {}
      <Route
        path="/register-success"
        element={
          <ProtectedRoute allowedRoles={["admin", "citizen"]}>
            <RegisterSuccessPage />
          </ProtectedRoute>
        }
      />

      {}
      <Route
        path="/submit-report"
        element={
          <ProtectedRoute allowedRoles={["citizen"]}>
            <SubmitReportPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/submit-success"
        element={
          <ProtectedRoute allowedRoles={["citizen"]}>
            <SubmitSuccessPage />
          </ProtectedRoute>
        }
      />

      {}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analytics"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <UsersList />
          </ProtectedRoute>
        }
      />

      {}
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminProfileManagement />
          </ProtectedRoute>
        }
      />

      {}
      <Route
        path="/reports"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ReportsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports/:id"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <ReportDetailsPage />
          </ProtectedRoute>
        }
      />

      {}
      <Route
        path="/drones"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DronesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/drones/new"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AddDronePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/drones/created"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DroneCreatedPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/drones/:id"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DroneDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/assign-drone/:reportId"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AssignDronePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;

