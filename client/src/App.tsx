import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import Home from "./pages/Home";
import MainLayout from "./layout/MainLayout";
import MyLearning from "./pages/student/Learning";
import Profile from "./pages/student/Profile";
import {
  PrivateAdminRoute,
  PrivateRoute,
  PublicRoute,
  PurchasedCourseRoute,
} from "./components/RouteGuards";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import CourseTable from "./pages/admin/course/CourseTable";
import AddCourse from "./pages/admin/course/AddCourse";
import EditCourse from "./pages/admin/course/EditCourse";
import CreateLecture from "./pages/admin/lecture/CreateLecture";
import EditLecture from "./pages/admin/lecture/EditLecture";
import CourseDetail from "./pages/student/CourseDetail";
import CourseProgress from "./pages/student/CourseProgress";
import SearchPage from "./pages/student/SearchPage";
import LoginWithEmail from "./pages/LoginWithEmail";
import Passkeys from "./pages/Passkeys";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <MainLayout>
                <Login />
              </MainLayout>
            </PublicRoute>
          }
        />
        <Route
          path="/otp"
          element={
            <MainLayout>
              <LoginWithEmail />
            </MainLayout>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout>
                <Home />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/learning"
          element={
            <PrivateRoute>
              <MainLayout>
                <MyLearning />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <MainLayout>
                <Profile />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/passkeys"
          element={
            <PrivateRoute>
              <MainLayout>
                <Passkeys />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/search"
          element={
            <PrivateRoute>
              <MainLayout>
                <SearchPage />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/course-detail/:courseId"
          element={
            <MainLayout>
              <CourseDetail />
            </MainLayout>
          }
        />
        <Route
          path="/course-progress/:courseId"
          element={
            <PurchasedCourseRoute>
              <MainLayout>
                <CourseProgress />
              </MainLayout>
            </PurchasedCourseRoute>
          }
        />

        {/* admin  routes */}
        <Route
          path="/admin"
          element={
            <PrivateAdminRoute>
              <MainLayout>
                <AdminLayout />
              </MainLayout>
            </PrivateAdminRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="course" element={<CourseTable />} />
          <Route path="course/create" element={<AddCourse />} />
          <Route path="course/:courseId" element={<EditCourse />} />
          <Route path="course/:courseId/lecture" element={<CreateLecture />} />
          <Route
            path="course/:courseId/lecture/:lectureId"
            element={<EditLecture />}
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
