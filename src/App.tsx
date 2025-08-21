import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./contexts/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import DriverProfile from "./pages/DriverProfile";
import DriverLogin from "./pages/auth/DriverLogin";
import DriverRegister from "./pages/auth/DriverRegister";
import SearchResults from "./pages/SearchResults";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              {<Route path="/search" element={<SearchResults />} />}
              <Route path="/driver/:driverId" element={<DriverProfile />} />
              <Route path="/profile" element={<Profile />} />

              {/* Driver Routes */}
              <Route path="/driver/login" element={<DriverLogin />} />
              <Route path="/driver/register" element={<DriverRegister />} />
              {/* Redirect dashboard to profile */}
              <Route
                path="/driver/dashboard"
                element={
                  <ProtectedRoute requiredRole="driver">
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
