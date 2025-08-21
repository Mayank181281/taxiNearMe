export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
};

export const validateAadhaar = (aadhaar: string): boolean => {
  const aadhaarRegex = /^\d{12}$/;
  return aadhaarRegex.test(aadhaar);
};

export const validateVehicleNumber = (vehicleNumber: string): boolean => {
  const vehicleRegex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{1,4}$/;
  return vehicleRegex.test(vehicleNumber.toUpperCase());
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateFile = (file: File): {
  isValid: boolean;
  error?: string;
} => {
  const maxSize = 2 * 1024 * 1024; // 2MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Only JPG, JPEG, and PNG files are allowed'
    };
  }
  
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size must be less than 2MB'
    };
  }
  
  return { isValid: true };
};