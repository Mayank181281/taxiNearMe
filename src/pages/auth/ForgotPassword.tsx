import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Car, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { sendPasswordResetEmailToUser } from "../../services/authService";
import { validateEmail } from "../../utils/validation";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await sendPasswordResetEmailToUser(email);

      if (result.success) {
        setEmailSent(true);
        setErrors({});
      } else {
        setErrors({
          general: result.error || "Failed to send password reset email",
        });
      }
    } catch (error) {
      console.error("Password reset error:", error);
      setErrors({ general: "An error occurred. Please try again." });
    }

    setIsLoading(false);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="bg-green-600 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Email Sent!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Password reset instructions sent to your email
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center mb-6">
              <div className="flex items-center justify-center mb-3">
                <Mail className="h-6 w-6 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-green-900">
                  Check Your Email
                </h3>
              </div>
              <p className="text-sm text-green-800 mb-3">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-xs text-green-700 mb-4">
                Click the link in the email to reset your password. The link
                will expire in 1 hour for security reasons.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                Didn't receive the email? Check your spam folder or try again.
              </p>

              <button
                onClick={async () => {
                  setIsLoading(true);
                  const result = await sendPasswordResetEmailToUser(email);
                  if (result.success) {
                    // Email sent again successfully
                  }
                  setIsLoading(false);
                }}
                disabled={isLoading}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Resending..." : "Resend Email"}
              </button>

              <button
                onClick={() => {
                  setEmailSent(false);
                  setEmail("");
                  setErrors({});
                }}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Use Different Email
              </button>

              <div className="text-center">
                <Link
                  to="/driver/login"
                  className="inline-flex items-center text-blue-600 hover:text-blue-500 text-sm font-medium"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="bg-blue-600 p-3 rounded-full">
              <Car className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email to receive a password reset link
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
            </button>

            <div className="text-center">
              <Link
                to="/driver/login"
                className="inline-flex items-center text-blue-600 hover:text-blue-500 text-sm font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
