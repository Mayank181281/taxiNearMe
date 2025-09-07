import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../config/firebase";

export interface AdminAdvertisement {
  id: string;
  customerName: string;
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
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        customerName: data.name || "Unknown Customer",
        title: data.title,
        description: data.description,
        email: data.email,
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
    });
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
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        customerName: data.name || "Unknown Customer",
        title: data.title,
        description: data.description,
        email: data.email,
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
    });
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
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        customerName: data.name || "Unknown Customer",
        title: data.title,
        description: data.description,
        email: data.email,
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
    });
  } catch (error) {
    console.error(`Error fetching ${status} advertisements:`, error);
    throw error;
  }
};
