import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  confirmPasswordReset,
  signOut,
  User as FirebaseUser,
  ActionCodeSettings,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isPremium?: boolean;
  city?: string;
  state?: string;
  subscriptionEnd?: string;
  // Personal Information
  gender?: string;
  dateOfBirth?: string;
  address?: string;
  emergencyContact?: string;
  // Identification
  aadhaar?: string;
  driverLicense?: string;
  licenseExpiry?: string;
  experience?: string;
  // Vehicle Information
  vehicles?: Array<{
    id: string;
    type: string;
    model: string;
    number: string;
    year: string;
  }>;
  // Legacy vehicle fields (for backward compatibility)
  vehicleNumber?: string;
  vehicleType?: string;
  vehicleModel?: string;
  vehicleYear?: string;
  // Banking Information
  bankName?: string;
  bankAccount?: string;
  ifscCode?: string;
  // Profile Status
  profileCompleted?: boolean;
  emailVerified?: boolean;
  isApproved?: boolean;
  availabilityStatus?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  [key: string]: unknown;
}

/**
 * Register a new user with Firebase Auth and send email verification
 */
export const registerUser = async (
  userData: RegisterData
): Promise<{
  success: boolean;
  user?: FirebaseUser;
  error?: string;
}> => {
  try {
    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );

    const firebaseUser = userCredential.user;

    // Send email verification
    await sendEmailVerification(firebaseUser);

    // Create user profile document in Firestore
    const userProfile: UserProfile = {
      id: firebaseUser.uid,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      emailVerified: false,
      isPremium: false,
      profileCompleted: false,
      isApproved: false,
      availabilityStatus: "offline",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, "drivers", firebaseUser.uid), userProfile);

    // Sign out the user immediately after registration so they can't login without verification
    await signOut(auth);

    return {
      success: true,
      user: firebaseUser,
    };
  } catch (error: unknown) {
    console.error("Registration error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Registration failed";
    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Login user - only allows login if email is verified
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<{
  success: boolean;
  user?: FirebaseUser;
  userProfile?: UserProfile;
  error?: string;
}> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const firebaseUser = userCredential.user;

    // Check if email is verified
    if (!firebaseUser.emailVerified) {
      await signOut(auth);
      return {
        success: false,
        error:
          "Please verify your email before logging in. Check your inbox for the verification link.",
      };
    }

    // Get user profile from Firestore
    const userDoc = await getDoc(doc(db, "drivers", firebaseUser.uid));

    if (!userDoc.exists()) {
      await signOut(auth);
      return {
        success: false,
        error: "User profile not found. Please contact support.",
      };
    }

    const userProfile = userDoc.data() as UserProfile;

    // Update emailVerified status in profile if needed
    if (!userProfile.emailVerified) {
      await setDoc(
        doc(db, "drivers", firebaseUser.uid),
        {
          ...userProfile,
          emailVerified: true,
          updatedAt: new Date(),
        },
        { merge: true }
      );
    }

    return {
      success: true,
      user: firebaseUser,
      userProfile: {
        ...userProfile,
        emailVerified: true,
      },
    };
  } catch (error: unknown) {
    console.error("Login error:", error);
    let errorMessage = "Login failed";

    if (error instanceof Error) {
      if (error.message.includes("auth/user-not-found")) {
        errorMessage = "No account found with this email";
      } else if (error.message.includes("auth/wrong-password")) {
        errorMessage = "Incorrect password";
      } else if (error.message.includes("auth/invalid-email")) {
        errorMessage = "Invalid email format";
      } else if (error.message.includes("auth/user-disabled")) {
        errorMessage = "This account has been disabled";
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Logout user
 */
export const logoutUser = async (): Promise<boolean> => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
};

/**
 * Update user profile in Firestore
 */
export const updateUserProfile = async (
  userId: string,
  updateData: Partial<UserProfile>
): Promise<boolean> => {
  try {
    await setDoc(
      doc(db, "drivers", userId),
      {
        ...updateData,
        updatedAt: new Date(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error("Update profile error:", error);
    return false;
  }
};

/**
 * Get user profile from Firestore
 */
export const getUserProfile = async (
  userId: string
): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, "drivers", userId));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Get profile error:", error);
    return null;
  }
};

/**
 * Resend email verification
 */
export const resendEmailVerification = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return {
        success: false,
        error: "No user logged in",
      };
    }

    if (user.emailVerified) {
      return {
        success: false,
        error: "Email is already verified",
      };
    }

    await sendEmailVerification(user);
    return {
      success: true,
    };
  } catch (error: unknown) {
    console.error("Resend verification error:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to send verification email";
    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmailToUser = async (
  email: string
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    // Configure the action code settings (optional but recommended)
    const actionCodeSettings: ActionCodeSettings = {
      url: `${window.location.origin}/driver/reset-password`,
      handleCodeInApp: true,
    };

    await sendPasswordResetEmail(auth, email, actionCodeSettings);
    return {
      success: true,
    };
  } catch (error: unknown) {
    console.error("Password reset email error:", error);
    let errorMessage = "Failed to send password reset email";

    if (error instanceof Error) {
      if (error.message.includes("auth/user-not-found")) {
        errorMessage = "No account found with this email address";
      } else if (error.message.includes("auth/invalid-email")) {
        errorMessage = "Invalid email address format";
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Confirm password reset with new password
 */
export const confirmPasswordResetWithCode = async (
  oobCode: string,
  newPassword: string
): Promise<{
  success: boolean;
  error?: string;
}> => {
  try {
    await confirmPasswordReset(auth, oobCode, newPassword);
    return {
      success: true,
    };
  } catch (error: unknown) {
    console.error("Password reset confirmation error:", error);
    let errorMessage = "Failed to reset password";

    if (error instanceof Error) {
      if (error.message.includes("auth/expired-action-code")) {
        errorMessage =
          "The password reset link has expired. Please request a new one.";
      } else if (error.message.includes("auth/invalid-action-code")) {
        errorMessage =
          "The password reset link is invalid. Please request a new one.";
      } else if (error.message.includes("auth/weak-password")) {
        errorMessage =
          "The new password is too weak. Please choose a stronger password.";
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};
