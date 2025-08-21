import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/auth";
import {
  User,
  Car,
  CreditCard,
  Upload,
  Star,
  Trophy,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import PrimePackagesModal from "../components/PrimePackagesModal";
import {
  validateEmail,
  validatePhone,
  validateAadhaar,
  validateVehicleNumber,
} from "../utils/validation";

interface Vehicle {
  id: string;
  type: string;
  model: string;
  number: string;
  year: string;
  photo?: string;
}

interface User {
  name?: string;
  email?: string;
  phone?: string;
  gender?: string;
  aadhaar?: string;
  vehicleNumber?: string;
  city?: string;
  state?: string;
  address?: string;
  dateOfBirth?: string;
  emergencyContact?: string;
  vehicleType?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  driverLicense?: string;
  licenseExpiry?: string;
  experience?: string;
  role?: string;
  vehicles?: Vehicle[];
  // Professional fields for form input only
  languages?: string[];
  specialServices?: string[];
  availability?: {
    status: "online" | "offline" | "busy";
    workingHours: string;
    days: string[];
  };
}

const Profile: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const [showPrimeModal, setShowPrimeModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    aadhaar: "",
    vehicleNumber: "",
    city: "",
    state: "",
    address: "",
    dateOfBirth: "",
    emergencyContact: "",
    vehicleType: "",
    vehicleModel: "",
    vehicleYear: "",
    driverLicense: "",
    licenseExpiry: "",
    experience: "",
    // Additional professional fields
    profileImage: "",
    workingHours: "",
    workingDays: [] as string[],
    availabilityStatus: "offline" as "online" | "offline" | "busy",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [uploadingSections, setUploadingSections] = useState<{
    [key: string]: boolean;
  }>({});
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    type: "",
    model: "",
    number: "",
    year: "",
    photo: "",
  });
  // Additional professional fields state
  const [languages, setLanguages] = useState<string[]>([]);
  const [specialServices, setSpecialServices] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<string>("");
  const [workingDays, setWorkingDays] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: user.gender || "",
        aadhaar: user.aadhaar || "",
        vehicleNumber: user.vehicleNumber || "",
        city: user.city || "",
        state: user.state || "",
        address: user.address || "",
        dateOfBirth: user.dateOfBirth || "",
        emergencyContact: user.emergencyContact || "",
        vehicleType: user.vehicleType || "",
        vehicleModel: user.vehicleModel || "",
        vehicleYear: user.vehicleYear || "",
        driverLicense: user.driverLicense || "",
        licenseExpiry: user.licenseExpiry || "",
        experience: user.experience || "",
        // Initialize professional fields with fallback values
        profileImage: "",
        workingHours: "9:00 AM - 6:00 PM",
        workingDays: [],
        availabilityStatus: "offline",
      });

      // Initialize vehicles from user data
      if (user.vehicles && user.vehicles.length > 0) {
        setVehicles(user.vehicles);
      } else if (user.vehicleNumber) {
        // Convert legacy vehicle data to new format
        setVehicles([
          {
            id: "1",
            type: user.vehicleType || "",
            model: user.vehicleModel || "",
            number: user.vehicleNumber || "",
            year: user.vehicleYear || "",
          },
        ]);
      }

      // Initialize additional professional fields with defaults
      setLanguages(["Hindi", "English"]); // Default languages
      setSpecialServices([]); // Will be populated from form
      setProfileImage(""); // Will be uploaded
      setWorkingDays([
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ]); // Default working days
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!editData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!validateEmail(editData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!validatePhone(editData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (editData.aadhaar && !validateAadhaar(editData.aadhaar)) {
      newErrors.aadhaar = "Please enter a valid 12-digit Aadhaar number";
    }

    if (
      editData.vehicleNumber &&
      !validateVehicleNumber(editData.vehicleNumber)
    ) {
      newErrors.vehicleNumber =
        "Please enter a valid vehicle registration number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (user && updateUser) {
      const updatedUser = {
        ...user,
        ...editData,
        vehicles,
        // Add professional fields
        languages,
        specialServices,
        profileImage,
        availability: {
          status: editData.availabilityStatus,
          workingHours: editData.workingHours,
          days: workingDays,
        },
      };
      updateUser(updatedUser);
      setIsEditing(false);
    }
  };

  const handleAddVehicle = () => {
    if (vehicles.length >= 4) return;

    if (
      newVehicle.type &&
      newVehicle.model &&
      newVehicle.number &&
      newVehicle.year
    ) {
      const vehicle: Vehicle = {
        id: Date.now().toString(),
        ...newVehicle,
      };
      setVehicles([...vehicles, vehicle]);
      setNewVehicle({ type: "", model: "", number: "", year: "", photo: "" });
      setShowAddVehicle(false);
    }
  };

  const handleRemoveVehicle = (vehicleId: string) => {
    setVehicles(vehicles.filter((vehicle) => vehicle.id !== vehicleId));
  };

  const handleVehicleChange = (
    vehicleId: string,
    field: string,
    value: string
  ) => {
    setVehicles(
      vehicles.map((vehicle) =>
        vehicle.id === vehicleId ? { ...vehicle, [field]: value } : vehicle
      )
    );
  };

  const handlePhotoUpload = (
    vehicleId: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoData = e.target?.result as string;
        setVehicles(
          vehicles.map((vehicle) =>
            vehicle.id === vehicleId
              ? { ...vehicle, photo: photoData }
              : vehicle
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNewVehiclePhotoUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photoData = e.target?.result as string;
        setNewVehicle({ ...newVehicle, photo: photoData });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (section: string) => {
    setUploadingSections((prev) => ({ ...prev, [section]: true }));
    // Simulate file upload
    setTimeout(() => {
      setUploadingSections((prev) => ({ ...prev, [section]: false }));
      // You can add actual file upload logic here
    }, 2000);
  };

  const calculateProfileCompletion = (): number => {
    if (!user) return 0;

    const requiredFields = [
      user.name,
      user.email,
      user.phone,
      user.gender,
      user.city,
      user.address,
      user.driverLicense,
      user.experience,
    ];

    const completedFields = requiredFields.filter((field) => {
      return field && field.trim() !== "";
    }).length;

    return Math.round((completedFields / requiredFields.length) * 100);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Please log in to view your profile
          </h2>
        </div>
      </div>
    );
  }

  const profileCompletion = calculateProfileCompletion();
  const isPrime = user.role === "prime-driver";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-white" />
                </div>
                {isPrime && (
                  <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                    <Trophy className="h-4 w-4 text-yellow-800" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.name}
                </h1>
                <p className="text-gray-600">
                  {isPrime ? "Prime Driver" : "Regular Driver"}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">4.8 Rating</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600">256 Rides</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              {!isPrime && (
                <button
                  onClick={() => setShowPrimeModal(true)}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-4 py-2 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 transition-all"
                >
                  Upgrade to Prime
                </button>
              )}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                {isEditing ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Edit3 className="h-4 w-4" />
                )}
                <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
              </button>
            </div>
          </div>

          {/* Profile Completion */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Profile Completion
              </span>
              <span className="text-sm font-medium text-gray-900">
                {profileCompletion}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${profileCompletion}%` }}
              ></div>
            </div>
            {profileCompletion < 100 && (
              <p className="text-sm text-blue-600 mt-2">
                Complete your profile to start receiving ride requests
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Personal Information
              </h2>
              {isEditing && (
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.name ? "border-red-300" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                ) : (
                  <p className="text-gray-900">{user.name}</p>
                )}
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={editData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <p className="text-gray-900">
                    {user.gender || "Not specified"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.email ? "border-red-300" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                ) : (
                  <p className="text-gray-900">{user.email}</p>
                )}
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.phone ? "border-red-300" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                ) : (
                  <p className="text-gray-900">{user.phone}</p>
                )}
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={editData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">
                    {user.dateOfBirth || "Not specified"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Emergency Contact
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={editData.emergencyContact}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">
                    {user.emergencyContact || "Not specified"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    value={editData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your city"
                  />
                ) : (
                  <p className="text-gray-900">
                    {user.city || "Not specified"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="state"
                    value={editData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your state"
                  />
                ) : (
                  <p className="text-gray-900">
                    {user.state || "Not specified"}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={editData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">
                    {user.address || "Not specified"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Identification */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Identification & Licensing
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Aadhaar Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="aadhaar"
                    value={editData.aadhaar}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border ${
                      errors.aadhaar ? "border-red-300" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="12-digit Aadhaar number"
                  />
                ) : (
                  <p className="text-gray-900">
                    {user.aadhaar
                      ? `****-****-${user.aadhaar.slice(-4)}`
                      : "Not specified"}
                  </p>
                )}
                {errors.aadhaar && (
                  <p className="mt-1 text-sm text-red-600">{errors.aadhaar}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Driver's License
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="driverLicense"
                    value={editData.driverLicense}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="License number"
                  />
                ) : (
                  <p className="text-gray-900">
                    {user.driverLicense || "Not specified"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Expiry
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="licenseExpiry"
                    value={editData.licenseExpiry}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">
                    {user.licenseExpiry || "Not specified"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Driving Experience (Years)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="experience"
                    value={editData.experience}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                ) : (
                  <p className="text-gray-900">
                    {user.experience || "Not specified"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Professional Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Profile Image Upload */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Photo
                </label>
                <div className="flex items-center space-x-4">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                  {isEditing && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            setProfileImage(e.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="text-sm text-gray-600"
                    />
                  )}
                </div>
              </div>

              {/* Languages */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Languages Spoken
                </label>
                {isEditing ? (
                  <div className="space-y-2">
                    {[
                      "Hindi",
                      "English",
                      "Marathi",
                      "Tamil",
                      "Telugu",
                      "Gujarati",
                      "Bengali",
                      "Punjabi",
                    ].map((language) => (
                      <label key={language} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={languages.includes(language)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setLanguages([...languages, language]);
                            } else {
                              setLanguages(
                                languages.filter((l) => l !== language)
                              );
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">{language}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {languages.map((language, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Special Services */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Services
                </label>
                {isEditing ? (
                  <div className="space-y-2">
                    {[
                      "Airport Transfer",
                      "City Tours",
                      "Wedding Services",
                      "Night Service",
                      "Business Trips",
                      "Shopping Tours",
                      "Women's Safety Service",
                      "Medical Assistance",
                      "Tourist Services",
                      "Local Sightseeing",
                      "Heritage Tours",
                    ].map((service) => (
                      <label key={service} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={specialServices.includes(service)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSpecialServices([...specialServices, service]);
                            } else {
                              setSpecialServices(
                                specialServices.filter((s) => s !== service)
                              );
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">{service}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {specialServices.map((service, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">{service}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Working Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Working Hours
                </label>
                {isEditing ? (
                  <select
                    name="workingHours"
                    value={editData.workingHours}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select working hours</option>
                    <option value="24/7">24/7 Available</option>
                    <option value="6:00 AM - 10:00 PM">
                      6:00 AM - 10:00 PM
                    </option>
                    <option value="7:00 AM - 9:00 PM">7:00 AM - 9:00 PM</option>
                    <option value="8:00 AM - 8:00 PM">8:00 AM - 8:00 PM</option>
                    <option value="9:00 AM - 6:00 PM">9:00 AM - 6:00 PM</option>
                    <option value="5:00 AM - 11:00 PM">
                      5:00 AM - 11:00 PM
                    </option>
                  </select>
                ) : (
                  <p className="text-gray-900">
                    {editData.workingHours || "Not specified"}
                  </p>
                )}
              </div>

              {/* Working Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Working Days
                </label>
                {isEditing ? (
                  <div className="space-y-2">
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((day) => (
                      <label key={day} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={workingDays.includes(day)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setWorkingDays([...workingDays, day]);
                            } else {
                              setWorkingDays(
                                workingDays.filter((d) => d !== day)
                              );
                            }
                          }}
                          className="mr-2"
                        />
                        <span className="text-sm">{day}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-900">
                    {workingDays.length > 0
                      ? workingDays.join(", ")
                      : "Not specified"}
                  </p>
                )}
              </div>

              {/* Availability Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Availability
                </label>
                {isEditing ? (
                  <select
                    name="availabilityStatus"
                    value={editData.availabilityStatus}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="online">Online - Available for rides</option>
                    <option value="busy">Busy - Currently on a ride</option>
                    <option value="offline">Offline - Not available</option>
                  </select>
                ) : (
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      editData.availabilityStatus === "online"
                        ? "text-green-600 bg-green-100"
                        : editData.availabilityStatus === "busy"
                        ? "text-yellow-600 bg-yellow-100"
                        : "text-gray-600 bg-gray-100"
                    }`}
                  >
                    <span className="w-2 h-2 bg-current rounded-full mr-2"></span>
                    {editData.availabilityStatus === "online"
                      ? "Available"
                      : editData.availabilityStatus === "busy"
                      ? "Busy"
                      : "Offline"}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Vehicle Information
              </h2>
              {isEditing && vehicles.length < 4 && (
                <button
                  onClick={() => setShowAddVehicle(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Vehicle</span>
                </button>
              )}
            </div>

            {/* Vehicle Limit Warning */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
              <div className="flex items-center space-x-2">
                <Car className="h-5 w-5 text-blue-600" />
                <p className="text-sm text-blue-800">
                  <strong>Vehicle Management:</strong> You can add up to 4
                  vehicles with photos.
                  <span className="font-semibold">
                    {" "}
                    Current: {vehicles.length}/4
                  </span>
                </p>
              </div>
            </div>

            {/* Existing Vehicles */}
            {vehicles.length > 0 ? (
              <div className="space-y-6">
                {vehicles.map((vehicle, index) => (
                  <div
                    key={vehicle.id}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                        <Car className="h-5 w-5 text-blue-600" />
                        <span>Vehicle {index + 1}</span>
                      </h3>
                      {isEditing && vehicles.length > 1 && (
                        <button
                          onClick={() => handleRemoveVehicle(vehicle.id)}
                          className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-800 transition-colors p-2 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Vehicle Photo */}
                      <div className="lg:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Vehicle Photo
                        </label>
                        <div className="relative">
                          {vehicle.photo ? (
                            <div className="relative group">
                              <img
                                src={vehicle.photo}
                                alt={`Vehicle ${index + 1}`}
                                className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                              />
                              {isEditing && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                  <label className="bg-white text-gray-900 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                                    <Upload className="h-4 w-4 inline mr-2" />
                                    Change Photo
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={(e) =>
                                        handlePhotoUpload(vehicle.id, e)
                                      }
                                    />
                                  </label>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                              {isEditing ? (
                                <label className="cursor-pointer text-center">
                                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                  <span className="text-sm text-gray-600">
                                    Upload Vehicle Photo
                                  </span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                      handlePhotoUpload(vehicle.id, e)
                                    }
                                  />
                                </label>
                              ) : (
                                <div className="text-center">
                                  <Car className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                  <span className="text-sm text-gray-600">
                                    No photo uploaded
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Vehicle Details */}
                      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Vehicle Type
                          </label>
                          {isEditing ? (
                            <select
                              value={vehicle.type}
                              onChange={(e) =>
                                handleVehicleChange(
                                  vehicle.id,
                                  "type",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Select Type</option>
                              <option value="car">Car</option>
                              <option value="bike">Bike</option>
                              <option value="auto">Auto Rickshaw</option>
                              <option value="truck">Truck</option>
                            </select>
                          ) : (
                            <p className="text-gray-900">
                              {vehicle.type || "Not specified"}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Vehicle Model
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={vehicle.model}
                              onChange={(e) =>
                                handleVehicleChange(
                                  vehicle.id,
                                  "model",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="e.g., Honda City"
                            />
                          ) : (
                            <p className="text-gray-900">
                              {vehicle.model || "Not specified"}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Registration Number
                          </label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={vehicle.number}
                              onChange={(e) =>
                                handleVehicleChange(
                                  vehicle.id,
                                  "number",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="e.g., UP16AB1234"
                            />
                          ) : (
                            <p className="text-gray-900">
                              {vehicle.number || "Not specified"}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Year of Manufacture
                          </label>
                          {isEditing ? (
                            <input
                              type="number"
                              value={vehicle.year}
                              onChange={(e) =>
                                handleVehicleChange(
                                  vehicle.id,
                                  "year",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              min="1990"
                              max={new Date().getFullYear()}
                            />
                          ) : (
                            <p className="text-gray-900">
                              {vehicle.year || "Not specified"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No vehicles added yet</p>
                {isEditing && (
                  <button
                    onClick={() => setShowAddVehicle(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Add Your First Vehicle
                  </button>
                )}
              </div>
            )}

            {/* Add Vehicle Modal */}
            {showAddVehicle && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      Add New Vehicle
                    </h3>
                    <button
                      onClick={() => setShowAddVehicle(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vehicle Type *
                      </label>
                      <select
                        value={newVehicle.type}
                        onChange={(e) =>
                          setNewVehicle({ ...newVehicle, type: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="car">Car</option>
                        <option value="bike">Bike</option>
                        <option value="auto">Auto Rickshaw</option>
                        <option value="truck">Truck</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vehicle Model *
                      </label>
                      <input
                        type="text"
                        value={newVehicle.model}
                        onChange={(e) =>
                          setNewVehicle({
                            ...newVehicle,
                            model: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Honda City"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Registration Number *
                      </label>
                      <input
                        type="text"
                        value={newVehicle.number}
                        onChange={(e) =>
                          setNewVehicle({
                            ...newVehicle,
                            number: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., UP16AB1234"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Year of Manufacture *
                      </label>
                      <input
                        type="number"
                        value={newVehicle.year}
                        onChange={(e) =>
                          setNewVehicle({ ...newVehicle, year: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="1990"
                        max={new Date().getFullYear()}
                        required
                      />
                    </div>
                  </div>

                  {/* Vehicle Photo Upload */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Photo (Optional)
                    </label>
                    <div className="relative">
                      {newVehicle.photo ? (
                        <div className="relative group">
                          <img
                            src={newVehicle.photo}
                            alt="New Vehicle"
                            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                            <label className="bg-white text-gray-900 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                              <Upload className="h-4 w-4 inline mr-2" />
                              Change Photo
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleNewVehiclePhotoUpload}
                              />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                          <label className="cursor-pointer text-center">
                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <span className="text-sm text-gray-600">
                              Upload Vehicle Photo
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleNewVehiclePhotoUpload}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowAddVehicle(false)}
                      className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddVehicle}
                      disabled={
                        !newVehicle.type ||
                        !newVehicle.model ||
                        !newVehicle.number ||
                        !newVehicle.year
                      }
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Add Vehicle
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Documents Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Documents</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">
                    Driver's License
                  </h3>
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Upload a clear photo of your driver's license
                </p>
                <button
                  onClick={() => handleFileUpload("license")}
                  disabled={uploadingSections.license}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>
                    {uploadingSections.license
                      ? "Uploading..."
                      : "Upload License"}
                  </span>
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">
                    Vehicle Registration
                  </h3>
                  <Car className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Upload your vehicle registration certificate
                </p>
                <button
                  onClick={() => handleFileUpload("registration")}
                  disabled={uploadingSections.registration}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>
                    {uploadingSections.registration
                      ? "Uploading..."
                      : "Upload RC"}
                  </span>
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">Aadhaar Card</h3>
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Upload a clear photo of your Aadhaar card
                </p>
                <button
                  onClick={() => handleFileUpload("aadhaar")}
                  disabled={uploadingSections.aadhaar}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>
                    {uploadingSections.aadhaar
                      ? "Uploading..."
                      : "Upload Aadhaar"}
                  </span>
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">
                    Insurance Certificate
                  </h3>
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Upload your vehicle insurance certificate
                </p>
                <button
                  onClick={() => handleFileUpload("insurance")}
                  disabled={uploadingSections.insurance}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>
                    {uploadingSections.insurance
                      ? "Uploading..."
                      : "Upload Insurance"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-8 text-center">
          <button
            onClick={logout}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {showPrimeModal && (
        <PrimePackagesModal
          isOpen={showPrimeModal}
          onClose={() => setShowPrimeModal(false)}
        />
      )}
    </div>
  );
};

export default Profile;
