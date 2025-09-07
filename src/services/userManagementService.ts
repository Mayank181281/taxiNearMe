import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  signUpDate: string;
  lastLogin: string;
  status: "active" | "inactive" | "suspended";
  accountType: "Driver" | "Customer";
  totalAds: number;
  subscriptionPlan: "Free" | "VIP" | "VIP Prime";
  createdAt: Date;
  updatedAt?: Date;
  // Additional fields from Firebase
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  profileImage?: string;
}

/**
 * Get all users from Firebase users collection
 */
export const getAllUsers = async (): Promise<AdminUser[]> => {
  try {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name:
          data.name ||
          `${data.firstName || ""} ${data.lastName || ""}`.trim() ||
          "Unknown User",
        email: data.email || "No email",
        phone: data.phone,
        signUpDate: data.createdAt
          ? data.createdAt.toDate().toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        lastLogin: data.updatedAt
          ? data.updatedAt.toDate().toISOString().split("T")[0]
          : data.createdAt
          ? data.createdAt.toDate().toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        status: data.status || "active",
        accountType: "Driver", // Assuming all users in this system are drivers
        totalAds: 0, // Will be calculated separately
        subscriptionPlan: data.subscriptionPlan || "Free",
        createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : undefined,
        firstName: data.firstName,
        lastName: data.lastName,
        city: data.city,
        state: data.state,
        profileImage: data.profileImage,
      } as AdminUser;
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

/**
 * Get users with their advertisement counts
 */
export const getUsersWithAdCounts = async (): Promise<AdminUser[]> => {
  try {
    // Get all users first
    const users = await getAllUsers();

    // Get all advertisements to count per user
    const adsQuery = query(collection(db, "adData"));
    const adsSnapshot = await getDocs(adsQuery);

    // Count ads per user
    const adCounts: { [userId: string]: number } = {};
    adsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.userId) {
        adCounts[data.userId] = (adCounts[data.userId] || 0) + 1;
      }
    });

    // Update users with ad counts and determine subscription plans
    return users.map((user) => {
      const totalAds = adCounts[user.id] || 0;

      // Determine subscription plan based on ads (this is a simplified logic)
      let subscriptionPlan: "Free" | "VIP" | "VIP Prime" = "Free";

      // Check if user has any VIP Prime ads
      const hasVipPrime = adsSnapshot.docs.some(
        (doc) => doc.data().userId === user.id && doc.data().tag === "vip-prime"
      );
      // Check if user has any VIP ads
      const hasVip = adsSnapshot.docs.some(
        (doc) => doc.data().userId === user.id && doc.data().tag === "vip"
      );

      if (hasVipPrime) {
        subscriptionPlan = "VIP Prime";
      } else if (hasVip) {
        subscriptionPlan = "VIP";
      }

      return {
        ...user,
        totalAds,
        subscriptionPlan,
      };
    });
  } catch (error) {
    console.error("Error fetching users with ad counts:", error);
    throw error;
  }
};

/**
 * Update user status (active, inactive, suspended)
 */
export const updateUserStatus = async (
  userId: string,
  status: "active" | "inactive" | "suspended"
): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      status,
      updatedAt: new Date(),
    });
    console.log(`User ${userId} status updated to ${status}`);
  } catch (error) {
    console.error("Error updating user status:", error);
    throw error;
  }
};

/**
 * Delete a user account
 */
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);
    await deleteDoc(userRef);
    console.log(`User ${userId} deleted successfully`);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

/**
 * Get users by status
 */
export const getUsersByStatus = async (
  status: "active" | "inactive" | "suspended"
): Promise<AdminUser[]> => {
  try {
    const q = query(
      collection(db, "users"),
      where("status", "==", status),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name:
          data.name ||
          `${data.firstName || ""} ${data.lastName || ""}`.trim() ||
          "Unknown User",
        email: data.email || "No email",
        phone: data.phone,
        signUpDate: data.createdAt
          ? data.createdAt.toDate().toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        lastLogin: data.updatedAt
          ? data.updatedAt.toDate().toISOString().split("T")[0]
          : data.createdAt
          ? data.createdAt.toDate().toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        status: data.status || "active",
        accountType: "Driver",
        totalAds: 0,
        subscriptionPlan: data.subscriptionPlan || "Free",
        createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : undefined,
        firstName: data.firstName,
        lastName: data.lastName,
        city: data.city,
        state: data.state,
        profileImage: data.profileImage,
      } as AdminUser;
    });
  } catch (error) {
    console.error(`Error fetching users with status ${status}:`, error);
    throw error;
  }
};

/**
 * Search users by name or email
 */
export const searchUsers = async (searchTerm: string): Promise<AdminUser[]> => {
  try {
    // Firebase doesn't support case-insensitive search, so we'll get all users and filter
    const allUsers = await getAllUsers();
    const searchLower = searchTerm.toLowerCase();

    return allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
    );
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
};
