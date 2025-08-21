import React from 'react';
import { X, Mail, Phone, Calendar, Crown, Star } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeToPrime: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onUpgradeToPrime }) => {
  if (!isOpen) return null;

  // Mock user data
  const userData = {
    name: 'John Doe',
    email: 'john@email.com',
    phone: '+1234567890',
    status: 'Active',
    ridesCompleted: 12,
    memberSince: 'January 2024',
    rating: 4.7,
    isPrime: false
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Profile Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          {/* Profile Picture and Basic Info */}
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                {userData.name.split(' ').map(n => n[0]).join('')}
              </div>
              {userData.isPrime && (
                <div className="absolute -top-1 -right-1 bg-orange-500 text-white p-1 rounded-full">
                  <Crown className="h-3 w-3" />
                </div>
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{userData.name}</h3>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                userData.status === 'Active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {userData.status}
              </div>
              {userData.isPrime && (
                <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                  <Crown className="h-3 w-3 mr-1" />
                  Prime Member
                </div>
              )}
            </div>
          </div>

          {/* User Information */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{userData.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">{userData.phone}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-medium text-gray-900">{userData.memberSince}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{userData.ridesCompleted}</p>
              <p className="text-sm text-gray-600">Rides Completed</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <p className="text-2xl font-bold text-yellow-600">{userData.rating}</p>
              </div>
              <p className="text-sm text-gray-600">Your Rating</p>
            </div>
          </div>

          {/* Upgrade to Prime Button */}
          {!userData.isPrime && (
            <button
              onClick={onUpgradeToPrime}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Crown className="h-5 w-5" />
              <span>Upgrade to Prime</span>
            </button>
          )}

          {userData.isPrime && (
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-xl p-4">
              <div className="flex items-center justify-center space-x-2 text-orange-700">
                <Crown className="h-5 w-5" />
                <span className="font-semibold">Prime Member Benefits Active</span>
              </div>
              <p className="text-sm text-orange-600 text-center mt-1">
                Enjoying priority booking and exclusive discounts
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;