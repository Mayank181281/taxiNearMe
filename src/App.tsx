import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./contexts/AuthContext";
import { AdsProvider } from "./contexts/AdsContext";
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
import SearchResults from "./pages/SearchResults";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <AdsProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/driver/:driverId" element={<DriverProfile />} />

                {/* Profile Routes - Direct routes without wrapper */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/your-adverts" element={<YourAdverts />} />
                <Route
                  path="/profile/order-history"
                  element={<OrderHistory />}
                />
                <Route path="/profile/plans" element={<Plans />} />
                <Route path="/profile/edit-profile" element={<EditProfile />} />
                <Route path="/profile/post-ads" element={<PostAds />} />
                <Route path="/profile/payment" element={<PaymentPage />} />

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
      </AdsProvider>
    </AuthProvider>
  );
}

export default App;
