import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { db, auth } from "../config/firebase";
import { User } from "../contexts/AuthContext";

export interface ProfileUpdateData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
}

/**
 * Updates user profile in both localStorage and Firebase Firestore
 */
export const updateUserProfile = async (
  userId: string,
  profileData: ProfileUpdateData
): Promise<{ success: boolean; message: string }> => {
  try {
    // Update in Firestore
    const userRef = doc(db, "users", userId);
    const fullName = `${profileData.firstName} ${profileData.lastName}`;

    await updateDoc(userRef, {
      name: fullName,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      email: profileData.email,
      updatedAt: new Date(),
    });

    // Update localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user: User = JSON.parse(storedUser);
      const updatedUser = {
        ...user,
        name: fullName,
        email: profileData.email,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update in drivers array
      const drivers = JSON.parse(localStorage.getItem("drivers") || "[]");
      const driverIndex = drivers.findIndex((d: User) => d.id === userId);
      if (driverIndex !== -1) {
        drivers[driverIndex] = {
          ...drivers[driverIndex],
          name: fullName,
          email: profileData.email,
        };
        localStorage.setItem("drivers", JSON.stringify(drivers));
      }
    }

    return { success: true, message: "Profile updated successfully!" };
  } catch (error) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update profile",
    };
  }
};

/**
 * Updates user password in Firebase Auth (if available) and localStorage
 */
export const updateUserPassword = async (
  userId: string,
  passwordData: PasswordUpdateData
): Promise<{ success: boolean; message: string }> => {
  try {
    // If Firebase Auth is being used
    if (auth.currentUser) {
      // Reauthenticate user before password change
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(
        user.email!,
        passwordData.currentPassword
      );

      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, passwordData.newPassword);
    }

    // Update in localStorage (for current localStorage-based auth system)
    const drivers = JSON.parse(localStorage.getItem("drivers") || "[]");
    const driverIndex = drivers.findIndex((d: User) => d.id === userId);

    if (driverIndex !== -1) {
      // Verify current password
      if (drivers[driverIndex].password !== passwordData.currentPassword) {
        return { success: false, message: "Current password is incorrect" };
      }

      // Update password
      drivers[driverIndex].password = passwordData.newPassword;
      localStorage.setItem("drivers", JSON.stringify(drivers));
    }

    return { success: true, message: "Password updated successfully!" };
  } catch (error) {
    console.error("Error updating password:", error);
    let message = "Failed to update password";

    if (error instanceof Error) {
      if (
        error.message.includes("wrong-password") ||
        error.message.includes("invalid-credential")
      ) {
        message = "Current password is incorrect";
      } else {
        message = error.message;
      }
    }

    return { success: false, message };
  }
};

/**
 * Creates or updates user profile in Firestore
 */
export const syncUserToFirestore = async (user: User): Promise<void> => {
  try {
    const userRef = doc(db, "users", user.id);
    await setDoc(
      userRef,
      {
        ...user,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error syncing user to Firestore:", error);
  }
};

/**
 * Gets user data from Firestore
 */
export const getUserFromFirestore = async (
  userId: string
): Promise<User | null> => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as User;
    }
    return null;
  } catch (error) {
    console.error("Error getting user from Firestore:", error);
    return null;
  }
};
