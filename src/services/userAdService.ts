import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

export interface UserAdSummary {
  userId: string;
  totalAds: number;
  vipPrimeCount: number;
  vipCount: number;
  freeCount: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export interface UserAdvertisement {
  id: string;
  userId: string;
  adId: string;
  title: string;
  description: string;
  status: "pending" | "approved" | "rejected" | "draft";
  tag: "free" | "vip" | "vip-prime";
  planDuration: number;
  planUnit: string;
  createdAt: Date;
  updatedAt?: Date;
  expiryDate?: Date;
  paymentDate?: Date;
  images: string[];
  location: {
    city: string;
    state: string;
  };
  contact: {
    phone: string;
    whatsapp: string;
  };
  approved?: boolean;
  // Payment information
  paymentMode?: string;
  transactionId?: string;
  // Previous plan information
  originalTag?: string;
  autoDowngraded?: boolean;
  downgradedAt?: Date;
}

export interface EnhancedUserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  signUpDate: string;
  lastLogin: string;
  status: "active" | "inactive" | "suspended";
  accountType: "Driver" | "Customer";
  adSummary: UserAdSummary;
  subscriptionPlan: "Free" | "VIP" | "VIP Prime";
  createdAt: Date;
  updatedAt?: Date;
  firstName?: string;
  lastName?: string;
  city?: string;
  state?: string;
  profileImage?: string;
}

/**
 * Get advertisement summary for a user
 */
export const getUserAdSummary = async (
  userId: string
): Promise<UserAdSummary> => {
  try {
    console.log("Fetching ad summary for user:", userId);

    const adsQuery = query(
      collection(db, "adData"),
      where("userId", "==", userId)
    );
    const adsSnapshot = await getDocs(adsQuery);

    console.log("Found", adsSnapshot.docs.length, "ads in adData for summary");

    let vipPrimeCount = 0;
    let vipCount = 0;
    let freeCount = 0;
    let pendingCount = 0;
    let approvedCount = 0;
    let rejectedCount = 0;

    adsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      console.log("Processing ad for summary:", {
        id: doc.id,
        tag: data.tag,
        status: data.status,
        approved: data.approved,
      });

      // Count by tag (plan type)
      if (data.tag === "vip-prime") vipPrimeCount++;
      else if (data.tag === "vip") vipCount++;
      else if (data.tag === "free") freeCount++;

      // Count by status
      if (data.status === "pending") pendingCount++;
      else if (data.status === "approved" || data.approved === true)
        approvedCount++;
      else if (data.status === "rejected") rejectedCount++;
    });

    const summary = {
      userId,
      totalAds: adsSnapshot.docs.length,
      vipPrimeCount,
      vipCount,
      freeCount,
      pendingCount,
      approvedCount,
      rejectedCount,
    };

    console.log("Ad summary for user", userId, ":", summary);
    return summary;
  } catch (error) {
    console.error("Error fetching user ad summary:", error);
    throw error;
  }
};

/**
 * Get all advertisements for a specific user
 */
export const getUserAdvertisements = async (
  userId: string
): Promise<UserAdvertisement[]> => {
  try {
    console.log("Fetching advertisements for user:", userId);

    const adsQuery = query(
      collection(db, "adData"),
      where("userId", "==", userId)
    );
    const adsSnapshot = await getDocs(adsQuery);

    console.log("Found", adsSnapshot.docs.length, "ads for user", userId);

    // Also check advertisements collection as fallback
    if (adsSnapshot.docs.length === 0) {
      console.log("Checking advertisements collection as fallback...");
      const fallbackQuery = query(
        collection(db, "advertisements"),
        where("userId", "==", userId)
      );
      const fallbackSnapshot = await getDocs(fallbackQuery);
      console.log(
        "Found",
        fallbackSnapshot.docs.length,
        "ads in advertisements collection"
      );

      if (fallbackSnapshot.docs.length > 0) {
        const fallbackAds = fallbackSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            userId: data.userId,
            adId: data.adId || doc.id,
            title: data.title || "Untitled Ad",
            description: data.description || "",
            status: data.status || "draft",
            tag: data.tag || "free",
            planDuration: data.planDuration || 1,
            planUnit: data.planUnit || "Day",
            createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
            updatedAt: data.updatedAt ? data.updatedAt.toDate() : undefined,
            expiryDate: data.expiryDate ? data.expiryDate.toDate() : undefined,
            paymentDate: data.paymentDate
              ? data.paymentDate.toDate()
              : undefined,
            images: data.images || data.photoUrls || [],
            location: {
              city: data.city || "",
              state: data.state || "",
            },
            contact: {
              phone: data.phone || "",
              whatsapp: data.whatsapp || "",
            },
            approved: data.approved,
            // Payment information
            paymentMode: data.paymentMode || undefined,
            transactionId: data.transactionId || undefined,
          } as UserAdvertisement;
        });

        // Sort fallback results too
        fallbackAds.sort(
          (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
        );
        return fallbackAds;
      }
    }

    const ads = adsSnapshot.docs.map((doc) => {
      const data = doc.data();
      console.log("Processing ad:", doc.id, "with data:", {
        userId: data.userId,
        title: data.title,
        tag: data.tag,
        status: data.status,
      });

      return {
        id: doc.id,
        userId: data.userId,
        adId: data.adId || doc.id,
        title: data.title || "Untitled Ad",
        description: data.description || "",
        status: data.status || "draft",
        tag: data.tag || "free",
        planDuration: data.planDuration || 1,
        planUnit: data.planUnit || "Day",
        createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        updatedAt: data.updatedAt ? data.updatedAt.toDate() : undefined,
        expiryDate: data.expiryDate ? data.expiryDate.toDate() : undefined,
        paymentDate: data.paymentDate ? data.paymentDate.toDate() : undefined,
        images: data.images || [],
        location: {
          city: data.city || "",
          state: data.state || "",
        },
        contact: {
          phone: data.phone || "",
          whatsapp: data.whatsapp || "",
        },
        approved: data.approved,
        // Payment information
        paymentMode: data.paymentMode || undefined,
        transactionId: data.transactionId || undefined,
      } as UserAdvertisement;
    });

    // Sort by createdAt in JavaScript instead of Firestore
    ads.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    console.log("Returning", ads.length, "processed ads for user", userId);
    return ads;
  } catch (error) {
    console.error("Error fetching user advertisements:", error);
    throw error;
  }
};

/**
 * Get enhanced user data with advertisement summary
 */
export const getEnhancedUsersData = async (): Promise<EnhancedUserData[]> => {
  try {
    // Get all users from users collection
    const usersQuery = query(
      collection(db, "users"),
      orderBy("createdAt", "desc")
    );
    const usersSnapshot = await getDocs(usersQuery);

    const enhancedUsers: EnhancedUserData[] = [];

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const userId = userDoc.id;

      // Get ad summary for this user
      const adSummary = await getUserAdSummary(userId);

      // Determine subscription plan based on ads
      let subscriptionPlan: "Free" | "VIP" | "VIP Prime" = "Free";
      if (adSummary.vipPrimeCount > 0) {
        subscriptionPlan = "VIP Prime";
      } else if (adSummary.vipCount > 0) {
        subscriptionPlan = "VIP";
      }

      const enhancedUser: EnhancedUserData = {
        id: userId,
        name:
          userData.name ||
          `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
          "Unknown User",
        email: userData.email || "No email",
        phone: userData.phone,
        signUpDate: userData.createdAt
          ? userData.createdAt.toDate().toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        lastLogin: userData.updatedAt
          ? userData.updatedAt.toDate().toISOString().split("T")[0]
          : userData.createdAt
          ? userData.createdAt.toDate().toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        status: userData.status || "active",
        accountType: "Driver", // Assuming all users are drivers
        adSummary,
        subscriptionPlan,
        createdAt: userData.createdAt
          ? userData.createdAt.toDate()
          : new Date(),
        updatedAt: userData.updatedAt ? userData.updatedAt.toDate() : undefined,
        firstName: userData.firstName,
        lastName: userData.lastName,
        city: userData.city,
        state: userData.state,
        profileImage: userData.profileImage,
      };

      enhancedUsers.push(enhancedUser);
    }

    return enhancedUsers;
  } catch (error) {
    console.error("Error fetching enhanced users data:", error);
    throw error;
  }
};

/**
 * Get detailed advertisement by ID
 */
export const getAdvertisementDetails = async (
  adId: string
): Promise<UserAdvertisement | null> => {
  try {
    const adDoc = await getDoc(doc(db, "adData", adId));

    if (!adDoc.exists()) {
      return null;
    }

    const data = adDoc.data();

    return {
      id: adDoc.id,
      userId: data.userId,
      adId: data.adId || adDoc.id,
      title: data.title || "Untitled Ad",
      description: data.description || "",
      status: data.status || "draft",
      tag: data.tag || "free",
      planDuration: data.planDuration || 1,
      planUnit: data.planUnit || "Day",
      createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
      updatedAt: data.updatedAt ? data.updatedAt.toDate() : undefined,
      expiryDate: data.expiryDate ? data.expiryDate.toDate() : undefined,
      paymentDate: data.paymentDate ? data.paymentDate.toDate() : undefined,
      images: data.images || [],
      location: {
        city: data.city || "",
        state: data.state || "",
      },
      contact: {
        phone:
          data.phoneNumber ||
          data.contact?.phone ||
          data.phone ||
          data.contactInfo?.phone ||
          "",
        whatsapp:
          data.whatsappNumber ||
          data.contact?.whatsapp ||
          data.whatsapp ||
          data.contactInfo?.whatsapp ||
          "",
      },
      approved: data.approved,
      // Payment information
      paymentMode: data.paymentMode || undefined,
      transactionId: data.transactionId || undefined,
      // Previous plan information
      originalTag: data.originalTag || undefined,
      autoDowngraded: data.autoDowngraded || false,
      downgradedAt: data.downgradedAt ? data.downgradedAt.toDate() : undefined,
    } as UserAdvertisement;
  } catch (error) {
    console.error("Error fetching advertisement details:", error);
    throw error;
  }
};
