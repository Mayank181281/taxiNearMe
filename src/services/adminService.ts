import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

export interface AdminAdvertisement {
  id: string;
  customerEmail: string; // Changed from customerName to customerEmail
  title: string;
  description: string;
  email: string;
  category: string;
  state: string;
  city: string;
  phoneNumber: string;
  whatsappNumber?: string;
  photoUrls: string[];
  subscriptionPlan: "Free" | "VIP" | "VIP Prime";
  tag: "free" | "vip" | "vip-prime";
  submittedDate: string;
  location: string;
  status: "pending" | "approved" | "rejected" | "published";
  userId: string;
  transactionId?: string;
  paymentMode?: string;
  createdAt: Date;
  publishedAt?: Date;
  expiryDate?: Date;
}

/**
 * Helper function to get user email by userId
 */
const getUserEmail = async (userId: string): Promise<string> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.email || "No Email";
    }
    return "User Not Found";
  } catch (error) {
    console.error(`Error fetching user email for userId ${userId}:`, error);
    return "Email Error";
  }
};

/**
 * Get all advertisements pending admin approval
 */
export const getPendingAdvertisements = async (): Promise<
  AdminAdvertisement[]
> => {
  try {
    // Get all ads with "pending" status from adData collection
    const q = query(
      collection(db, "adData"),
      where("status", "==", "pending"),
      orderBy("publishedAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const ads = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const customerEmail = await getUserEmail(data.userId);

        return {
          id: doc.id,
          customerEmail: customerEmail,
          title: data.title,
          description: data.description,
          email: data.email || customerEmail, // Fallback to fetched email
          category: data.category,
          state: data.state,
          city: data.city,
          phoneNumber: data.phoneNumber,
          whatsappNumber: data.whatsappNumber,
          photoUrls: data.photoUrls || [],
          subscriptionPlan:
            data.tag === "vip-prime"
              ? "VIP Prime"
              : data.tag === "vip"
              ? "VIP"
              : "Free",
          tag: data.tag,
          submittedDate: data.publishedAt
            ? data.publishedAt.toDate().toISOString().split("T")[0]
            : data.createdAt
            ? data.createdAt.toDate().toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          location: `${data.city}, ${data.state}`,
          status: data.status,
          userId: data.userId,
          transactionId: data.transactionId,
          paymentMode: data.paymentMode,
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
          publishedAt: data.publishedAt ? data.publishedAt.toDate() : undefined,
          expiryDate: data.expiryDate ? data.expiryDate.toDate() : undefined,
        } as AdminAdvertisement;
      })
    );

    return ads;
  } catch (error) {
    console.error("Error fetching pending advertisements:", error);
    throw error;
  }
};

/**
 * Get all advertisements for admin management (all statuses)
 */
export const getAllAdvertisementsForAdmin = async (): Promise<
  AdminAdvertisement[]
> => {
  try {
    const q = query(collection(db, "adData"), orderBy("publishedAt", "desc"));

    const querySnapshot = await getDocs(q);
    const ads = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const customerEmail = await getUserEmail(data.userId);

        return {
          id: doc.id,
          customerEmail: customerEmail,
          title: data.title,
          description: data.description,
          email: data.email || customerEmail, // Fallback to fetched email
          category: data.category,
          state: data.state,
          city: data.city,
          phoneNumber: data.phoneNumber,
          whatsappNumber: data.whatsappNumber,
          photoUrls: data.photoUrls || [],
          subscriptionPlan:
            data.tag === "vip-prime"
              ? "VIP Prime"
              : data.tag === "vip"
              ? "VIP"
              : "Free",
          tag: data.tag,
          submittedDate: data.publishedAt
            ? data.publishedAt.toDate().toISOString().split("T")[0]
            : data.createdAt
            ? data.createdAt.toDate().toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          location: `${data.city}, ${data.state}`,
          status: data.status,
          userId: data.userId,
          transactionId: data.transactionId,
          paymentMode: data.paymentMode,
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
          publishedAt: data.publishedAt ? data.publishedAt.toDate() : undefined,
          expiryDate: data.expiryDate ? data.expiryDate.toDate() : undefined,
        } as AdminAdvertisement;
      })
    );

    return ads;
  } catch (error) {
    console.error("Error fetching all advertisements:", error);
    throw error;
  }
};

/**
 * Approve an advertisement
 */
export const approveAdvertisement = async (adId: string): Promise<void> => {
  try {
    const adRef = doc(db, "adData", adId);
    await updateDoc(adRef, {
      status: "approved",
      approved: true,
      updatedAt: new Date(),
    });
    console.log(`Advertisement ${adId} approved successfully`);
  } catch (error) {
    console.error("Error approving advertisement:", error);
    throw error;
  }
};

/**
 * Reject an advertisement
 */
export const rejectAdvertisement = async (adId: string): Promise<void> => {
  try {
    const adRef = doc(db, "adData", adId);
    await updateDoc(adRef, {
      status: "rejected",
      approved: false,
      updatedAt: new Date(),
    });
    console.log(`Advertisement ${adId} rejected successfully`);
  } catch (error) {
    console.error("Error rejecting advertisement:", error);
    throw error;
  }
};

/**
 * Get advertisements by status for filtering
 */
export const getAdvertisementsByStatus = async (
  status: "pending" | "approved" | "rejected"
): Promise<AdminAdvertisement[]> => {
  try {
    const q = query(
      collection(db, "adData"),
      where("status", "==", status),
      orderBy("publishedAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const ads = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        const customerEmail = await getUserEmail(data.userId);

        return {
          id: doc.id,
          customerEmail: customerEmail,
          title: data.title,
          description: data.description,
          email: data.email || customerEmail, // Fallback to fetched email
          category: data.category,
          state: data.state,
          city: data.city,
          phoneNumber: data.phoneNumber,
          whatsappNumber: data.whatsappNumber,
          photoUrls: data.photoUrls || [],
          subscriptionPlan:
            data.tag === "vip-prime"
              ? "VIP Prime"
              : data.tag === "vip"
              ? "VIP"
              : "Free",
          tag: data.tag,
          submittedDate: data.publishedAt
            ? data.publishedAt.toDate().toISOString().split("T")[0]
            : data.createdAt
            ? data.createdAt.toDate().toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
          location: `${data.city}, ${data.state}`,
          status: data.status,
          userId: data.userId,
          transactionId: data.transactionId,
          paymentMode: data.paymentMode,
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
          publishedAt: data.publishedAt ? data.publishedAt.toDate() : undefined,
          expiryDate: data.expiryDate ? data.expiryDate.toDate() : undefined,
        } as AdminAdvertisement;
      })
    );

    return ads;
  } catch (error) {
    console.error(`Error fetching ${status} advertisements:`, error);
    throw error;
  }
};

export const deleteAdvertisementFromAdmin = async (
  id: string
): Promise<void> => {
  try {
    const adRef = doc(db, "adData", id);
    await deleteDoc(adRef);
  } catch (error) {
    console.error("Error deleting advertisement:", error);
    throw error;
  }
};
