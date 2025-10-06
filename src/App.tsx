import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./contexts/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import YourAdverts from "./pages/YourAdverts";
import OrderHistory from "./pages/OrderHistory";
import Plans from "./pages/Plans";
import EditProfile from "./pages/EditProfile";
import PostAds from "./pages/PostAds";
import PaymentPage from "./pages/PaymentPage";
import DriverProfile from "./pages/DriverProfile";
import DriverLogin from "./pages/auth/DriverLogin";
import DriverRegister from "./pages/auth/DriverRegister";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import SearchResults from "./pages/SearchResults";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./admin/Admin";
import { useAutoExpiration } from "./hooks/useAutoExpiration";

function App() {
  // Initialize automatic ad expiration system
  useAutoExpiration(true);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Routes>
            {/* Admin Route - No Header/Footer */}
            <Route path="/admin/*" element={<Admin />} />

            {/* Main Application Routes */}
            <Route
              path="/*"
              element={
                <>
                  <Header />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/contact" element={<ContactUs />} />
                      <Route path="/about" element={<AboutUs />} />
                      <Route
                        path="/:category/:city"
                        element={<SearchResults />}
                      />
                      {/* New SEO-friendly ad detail routes */}
                      <Route
                        path="/:citySlug/:categorySlug/:titleSlug"
                        element={<DriverProfile />}
                      />
                      {/* Legacy routes for backward compatibility */}
                      <Route
                        path="/driver/:driverId"
                        element={<DriverProfile />}
                      />
                      <Route
                        path="/driver-profile/:driverId"
                        element={<DriverProfile />}
                      />

                      {/* Profile Routes - Direct routes without wrapper */}
                      <Route path="/profile" element={<Profile />} />
                      <Route
                        path="/profile/your-adverts"
                        element={<YourAdverts />}
                      />
                      <Route
                        path="/profile/order-history"
                        element={<OrderHistory />}
                      />
                      <Route path="/profile/plans" element={<Plans />} />
                      <Route
                        path="/profile/edit-profile"
                        element={<EditProfile />}
                      />
                      <Route path="/profile/post-ads" element={<PostAds />} />
                      <Route
                        path="/profile/payment"
                        element={<PaymentPage />}
                      />

                      {/* Driver Routes */}
                      <Route path="/driver/login" element={<DriverLogin />} />
                      <Route
                        path="/driver/register"
                        element={<DriverRegister />}
                      />
                      <Route
                        path="/driver/forgot-password"
                        element={<ForgotPassword />}
                      />
                      <Route
                        path="/driver/reset-password"
                        element={<ResetPassword />}
                      />
                      {/* Redirect dashboard to profile */}
                      <Route
                        path="/driver/dashboard"
                        element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </main>
                  <Footer />
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
