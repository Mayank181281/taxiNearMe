import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAds } from "../contexts/AdsContext";
import {
  getAllStates,
  getCitiesByState,
  getCategories,
} from "../utils/statesAndCities";

interface AdFormData {
  email: string;
  title: string;
  category: string;
  description: string;
  state: string;
  city: string;
  phone: string;
  whatsapp: string;
  images: File[];
}

const PostAds: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const isEditing = Boolean(editId);
  const { addAd, updateAd, getAdById } = useAds();

  const [formData, setFormData] = useState<AdFormData>({
    email: "",
    title: "",
    category: "",
    description: "",
    state: "",
    city: "",
    phone: "",
    whatsapp: "",
    images: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Load existing ad data when editing
  useEffect(() => {
    if (isEditing && editId) {
      const existingAd = getAdById(editId);
      if (existingAd) {
        setFormData({
          email: existingAd.email,
          title: existingAd.title,
          category: existingAd.category,
          description: existingAd.description,
          state: existingAd.state,
          city: existingAd.city,
          phone: existingAd.phone,
          whatsapp: existingAd.whatsapp,
          images: [], // File objects can't be restored, but we'll show existing images in preview
        });
        if (existingAd.image) {
          setImagePreviews([existingAd.image]);
        }
      }
    }
  }, [isEditing, editId, getAdById]);

  const categories = getCategories();

  const states = getAllStates();
  const cities = formData.state ? getCitiesByState(formData.state) : [];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Clear city when state changes
      ...(name === "state" && { city: "" }),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Check if adding new files would exceed the limit
    const currentImagesCount = formData.images.length;
    const availableSlots = 2 - currentImagesCount;
    const filesToAdd = files.slice(0, availableSlots);

    if (filesToAdd.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...filesToAdd],
      }));

      // Create previews for new images
      const newPreviews: string[] = [];
      filesToAdd.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          newPreviews.push(result);
          if (newPreviews.length === filesToAdd.length) {
            setImagePreviews((prev) => [...prev, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }

    // Show alert if user tried to upload more than allowed
    if (files.length > availableSlots) {
      alert(
        `Maximum 2 photos allowed. Only ${filesToAdd.length} photos were added.`
      );
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (isEditing && editId) {
        // Update existing ad
        const imageUrls = imagePreviews.length > 0 ? imagePreviews[0] : null; // For compatibility, use first image
        updateAd(editId, {
          email: formData.email,
          title: formData.title,
          category: formData.category,
          description: formData.description,
          state: formData.state,
          city: formData.city,
          phone: formData.phone,
          whatsapp: formData.whatsapp,
          image: imageUrls,
        });
        console.log("Ad updated:", formData, "ID:", editId);
      } else {
        // Create new ad - use default image if none uploaded
        const imageUrl =
          imagePreviews.length > 0
            ? imagePreviews[0]
            : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face";
        addAd({
          email: formData.email,
          title: formData.title,
          category: formData.category,
          description: formData.description,
          state: formData.state,
          city: formData.city,
          phone: formData.phone,
          whatsapp: formData.whatsapp,
          image: imageUrl,
        });
        console.log("New ad created:", formData);
      }

      // Navigate to your adverts page
      navigate("/profile/your-adverts");
    } catch (error) {
      console.error(
        `Error ${isEditing ? "updating" : "submitting"} ad:`,
        error
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-blue-600 mb-2">
          {isEditing ? "Update your Ads" : "Post Your Advertisement"}
        </h1>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-blue-50 p-6 rounded-lg space-y-6"
      >
        {/* Email */}
        <div>
          <label className="block text-blue-600 font-medium mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Title and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-blue-600 font-medium mb-2">
              Title of your ad
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-blue-600 font-medium mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-blue-600 font-medium mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            maxLength={300}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="text-sm text-gray-500 mt-1 text-right">
            {formData.description.length}/300 characters
          </div>
        </div>

        {/* State and City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-blue-600 font-medium mb-2">
              Select State
            </label>
            <select
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select</option>
              {states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-blue-600 font-medium mb-2">
              Select City
            </label>
            <select
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Phone and WhatsApp */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-blue-600 font-medium mb-2">
              Phone number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Your Number"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-blue-600 font-medium mb-2">
              WhatsApp number
            </label>
            <input
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleInputChange}
              placeholder="WhatsApp Number"
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-blue-600 font-medium mb-2">
            Choose photo to upload (Maximum 2 photos allowed)
          </label>
          <div className="space-y-4">
            {/* Upload Button */}
            <div className="relative">
              <input
                type="file"
                id="photo-upload"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={formData.images.length >= 2}
                className="sr-only"
              />
              <label
                htmlFor="photo-upload"
                className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-blue-500 ${
                  formData.images.length >= 2
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>
                  {formData.images.length >= 2
                    ? "Maximum photos reached"
                    : "Upload Or Drag"}
                </span>
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </label>
              <div className="text-xs text-gray-500 mt-1">
                {formData.images.length}/2 photos selected
              </div>
            </div>

            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-between pt-6">
          <button
            type="button"
            onClick={() => navigate("/profile/your-adverts")}
            className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center"
          >
            {isSubmitting && (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {isSubmitting
              ? isEditing
                ? "Updating..."
                : "Submitting..."
              : isEditing
              ? "Submit"
              : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostAds;
