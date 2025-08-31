import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Car, User, Mail, Lock, Phone, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import {
  validateEmail,
  validatePhone,
  validatePassword,
} from "../../utils/validation";

const DriverRegister: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSendOTP = async () => {
    if (!formData.email) {
      setErrors((prev) => ({
        ...prev,
        email: "Email is required to send OTP",
      }));
      return;
    }
    if (!validateEmail(formData.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }));
      return;
    }

    setIsOtpLoading(true);
    try {
      // Simulate OTP sending - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setEmailOtpSent(true);
      setErrors((prev) => ({ ...prev, email: "" }));
      console.log("OTP sent to:", formData.email);
    } catch {
      setErrors((prev) => ({
        ...prev,
        general: "Failed to send OTP. Please try again.",
      }));
    }
    setIsOtpLoading(false);
  };

  const handleVerifyOTP = async () => {
    if (!emailOtp.trim()) {
      setErrors((prev) => ({ ...prev, otp: "Please enter the OTP" }));
      return;
    }

    setIsOtpLoading(true);
    try {
      // Simulate OTP verification - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (emailOtp === "123456") {
        // Mock verification
        setEmailOtpVerified(true);
        setErrors((prev) => ({ ...prev, otp: "" }));
      } else {
        setErrors((prev) => ({
          ...prev,
          otp: "Invalid OTP. Please try again.",
        }));
      }
    } catch {
      setErrors((prev) => ({
        ...prev,
        otp: "OTP verification failed. Please try again.",
      }));
    }
    setIsOtpLoading(false);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    } else if (!emailOtpVerified) {
      newErrors.email = "Please verify your email with OTP";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.errors.join(", ");
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!termsAccepted) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const driverData = {
        ...formData,
        role: "driver" as const,
        isApproved: false,
        availabilityStatus: "offline",
        profileCompleted: false, // Flag to track if profile details are completed
      };

      const success = await register(driverData);

      if (success) {
        navigate("/driver/login");
      } else {
        setErrors({ general: "Registration failed. Please try again." });
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ general: "An error occurred. Please try again." });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="bg-blue-600 p-3 rounded-full">
              <Car className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Driver Registration
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Quick signup - Complete your profile later
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            {/* Essential Information Only */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border ${
                      errors.name ? "border-red-300" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={emailOtpVerified}
                    className={`w-full pl-10 pr-4 py-3 border ${
                      errors.email
                        ? "border-red-300"
                        : emailOtpVerified
                        ? "border-green-300 bg-green-50"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      emailOtpVerified ? "text-green-700" : ""
                    }`}
                    placeholder="Enter your email"
                  />
                  {emailOtpVerified && (
                    <div className="absolute right-3 top-3 text-green-500">
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}

                {/* OTP Section */}
                {!emailOtpVerified && (
                  <div className="mt-3 space-y-3">
                    <button
                      type="button"
                      onClick={handleSendOTP}
                      disabled={
                        !formData.email ||
                        !validateEmail(formData.email) ||
                        isOtpLoading ||
                        emailOtpSent
                      }
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                      {isOtpLoading
                        ? "Sending OTP..."
                        : emailOtpSent
                        ? "OTP Sent ✓"
                        : "Send Email OTP"}
                    </button>

                    {emailOtpSent && (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          value={emailOtp}
                          onChange={(e) => setEmailOtp(e.target.value)}
                          maxLength={6}
                          className={`w-full px-4 py-2 border ${
                            errors.otp ? "border-red-300" : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest`}
                        />
                        {errors.otp && (
                          <p className="text-sm text-red-600">{errors.otp}</p>
                        )}
                        <button
                          type="button"
                          onClick={handleVerifyOTP}
                          disabled={!emailOtp.trim() || isOtpLoading}
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                        >
                          {isOtpLoading ? "Verifying..." : "Verify OTP"}
                        </button>
                        <p className="text-xs text-gray-500 text-center">
                          Use OTP: <strong>123456</strong> (for demo)
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border ${
                      errors.phone ? "border-red-300" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Enter 10-digit phone number"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border ${
                      errors.password ? "border-red-300" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border ${
                      errors.confirmPassword
                        ? "border-red-300"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <input
                  id="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-700 leading-5"
                >
                  I agree to the{" "}
                  <a
                    href="/terms"
                    target="_blank"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    target="_blank"
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>
              {errors.terms && (
                <p className="text-sm text-red-600">{errors.terms}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !emailOtpVerified || !termsAccepted}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Registering..." : "Create Account"}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have a driver account?{" "}
                <Link
                  to="/driver/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DriverRegister;
