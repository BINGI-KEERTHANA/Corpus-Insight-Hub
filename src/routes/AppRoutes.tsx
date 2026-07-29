import { 
  BrowserRouter, 
  Routes, 
  Route,
  Navigate,
 } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login/Login";
import Records from "../pages/Records";
import SearchPage from "../pages/Search/Search";
import Profile from "../pages/Profile/Profile";
import Languages from "../pages/Languages";
import Categories from "../pages/Categories";
import RecordDetails from "../pages/RecordDetails";
import UploadDocuments from "../pages/UploadDocuments/UploadDocuments";
import AddRecord from "../pages/AddRecord/AddRecord";
import Analytics from "../pages/Analytics/Analytics";
import AISummary from "../pages/AISummary/AISummary";
import ServerHealth from "../pages/ServerHealth/ServerHealth";
import AudioQualityAssessment from "../pages/AudioQualityAssessment/AudioQualityAssessment";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<Login />} />

        {/* Dashboard */}
        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Layout>
        <Dashboard />
      </Layout>
    </ProtectedRoute>
  }
/>

<Route
  path="/records"
  element={
    <ProtectedRoute>
      <Layout>
        <Records />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/search"
  element={
    <ProtectedRoute>
      <Layout>
        <SearchPage />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Layout>
        <Profile />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/languages"
  element={
    <ProtectedRoute>
      <Layout>
        <Languages />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/categories"
  element={
    <ProtectedRoute>
      <Layout>
        <Categories />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/records/:id"
  element={
    <ProtectedRoute>
      <Layout>
        <RecordDetails />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
  path="/upload"
  element={
    <ProtectedRoute>
      <Layout>
        <UploadDocuments />
      </Layout>
    </ProtectedRoute>
  }
/>
<Route
          path="/add-record"
          element={
            <ProtectedRoute>
              <Layout>
                <AddRecord />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Layout>
                <Analytics />
              </Layout>
            </ProtectedRoute>
          }
        />


        <Route
          path="/ai-summary"
          element={
            <ProtectedRoute>
              <Layout>
                <AISummary />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/server-health"
          element={
            <ProtectedRoute>
              <Layout>
                <ServerHealth />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/audio-quality"
          element={
            <ProtectedRoute>
              <Layout>
                <AudioQualityAssessment />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}