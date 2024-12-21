import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import Home from "./pages/Home";
import MainLayout from "./layout/MainLayout";
import MyLearning from "./pages/student/Learning";
import Profile from "./pages/student/Profile";
import { PrivateRoute, PublicRoute } from "./components/RouteGuards";

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
      </Routes>
    </Router>
  );
};

export default App;
