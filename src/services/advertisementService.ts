import { db } from "../config/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { uploadToCloudinary } from "./cloudinaryService";

export interface Advertisement {
  id?: string;
  email: string;
  title: string;
  category: string;
  description: string;
  state: string;
  city: string;
  phoneNumber: string;
  whatsappNumber?: string;
  photoUrls: string[];
  createdAt: Date;
  userId: string;
  status?:
    | "inactive"
    | "waiting-approval"
    | "published"
    | "vip"
    | "vip-prime"
    | "draft"
    | "pending"
    | "approved"
    | "rejected";
  // New fields for adData collection
  tag?: "free" | "vip" | "vip-prime";
  planDuration?: number; // 1 or 30
  planUnit?: "Day";
  approved?: boolean;
  // Payment related fields
  transactionId?: string;
  paymentMode?: string;
  publishedAt?: Date;
  expiryDate?: Date;
}

export const publishDraftAdvertisement = async (
  draftId: string,
  planDetails: {
    tag: "free" | "vip" | "vip-prime";
    planDuration: number;
    planUnit: "Day";
  }
): Promise<string> => {
  try {
    console.log("Starting draft advertisement publishing...", {
      draftId,
      planDetails,
    });

    // Get the draft ad from advertisements collection
    const draftRef = doc(db, "advertisements", draftId);
    const draftDoc = await getDocs(
      query(collection(db, "advertisements"), where("__name__", "==", draftId))
    );

    if (draftDoc.empty) {
      throw new Error("Draft advertisement not found");
    }

    const draftData = draftDoc.docs[0].data();

    // Calculate expiry date
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + planDetails.planDuration);

    // Create the advertisement document in adData collection
    const docRef = await addDoc(collection(db, "adData"), {
      ...draftData,
      ...planDetails,
      approved: true, // Auto-approve for now
      status: "published",
      createdAt: draftData.createdAt, // Keep original creation time
      publishedAt: Timestamp.now(),
      expiryDate: Timestamp.fromDate(expiryDate),
    });

    console.log(
      "Draft advertisement published successfully with ID:",
      docRef.id
    );

    // Remove the draft from advertisements collection
    await deleteDoc(draftRef);
    console.log("Draft removed from advertisements collection");

    return docRef.id;
  } catch (error: unknown) {
    console.error("Error publishing draft advertisement:", error);
    throw error;
  }
};

export const publishAdvertisement = async (
  adData: Omit<Advertisement, "createdAt" | "photoUrls" | "approved">,
  photos: File[],
  planDetails: {
    tag: "free" | "vip" | "vip-prime";
    planDuration: number;
    planUnit: "Day";
  }
): Promise<string> => {
  try {
    console.log("Starting advertisement publishing...", {
      adData,
      planDetails,
    });

    // Upload photos to Cloudinary
    const photoUrls: string[] = [];

    for (const photo of photos) {
      console.log("Uploading photo to Cloudinary:", photo.name);
      const url = await uploadToCloudinary(photo);
      console.log("Photo uploaded successfully:", url);
      photoUrls.push(url);
    }

    console.log("All photos uploaded successfully");

    // Create the advertisement document in adData collection
    const docRef = await addDoc(collection(db, "adData"), {
      ...adData,
      photoUrls,
      ...planDetails,
      approved: true, // Auto-approve for now
      status: "published",
      createdAt: Timestamp.now(),
    });

    console.log("Advertisement published successfully with ID:", docRef.id);
    return docRef.id;
  } catch (error: unknown) {
    console.error("Error publishing advertisement:", error);
    throw error;
  }
};

export const createAdvertisement = async (
  adData: Omit<Advertisement, "createdAt" | "photoUrls">,
  photos: File[]
): Promise<string> => {
  try {
    console.log("Starting advertisement creation...", { adData });

    // Upload photos to Cloudinary
    const photoUrls: string[] = [];

    for (const photo of photos) {
      console.log("Uploading photo to Cloudinary:", photo.name);
      const url = await uploadToCloudinary(photo);
      console.log("Photo uploaded successfully:", url);
      photoUrls.push(url);
    }

    console.log("All photos uploaded successfully");

    // Check if an advertisement with similar data already exists
    const existingAdsQuery = query(
      collection(db, "advertisements"),
      where("userId", "==", adData.userId),
      where("title", "==", adData.title)
    );

    const existingDocs = await getDocs(existingAdsQuery);
    if (!existingDocs.empty) {
      throw new Error(
        "An advertisement with this title already exists. Please use a different title."
      );
    }

    // Create the advertisement document
    const docRef = await addDoc(collection(db, "advertisements"), {
      ...adData,
      photoUrls,
      status: "inactive",
      createdAt: Timestamp.now(),
    });

    console.log("Advertisement created successfully with ID:", docRef.id);
    return docRef.id;
  } catch (error: unknown) {
    console.error("Error creating advertisement:", error);
    if (error instanceof Error && error.message.includes("already exists")) {
      throw new Error(
        "An advertisement with this information already exists. Please try again with different details."
      );
    }
    throw error;
  }
};

export const updateAdvertisement = async (
  advertisementId: string,
  adData: Omit<Advertisement, "createdAt" | "photoUrls" | "id">,
  photos: File[],
  existingPhotoUrls: string[] = []
): Promise<void> => {
  try {
    console.log("Starting advertisement update...", {
      advertisementId,
      adData,
    });

    // Handle photo uploads - only upload new photos (File objects)
    const photoUrls: string[] = [...existingPhotoUrls];

    for (const photo of photos) {
      console.log("Uploading new photo to Cloudinary:", photo.name);
      const url = await uploadToCloudinary(photo);
      console.log("Photo uploaded successfully:", url);
      photoUrls.push(url);
    }

    console.log("Photos processed successfully");

    // Try to find the document in adData collection first
    try {
      const adDataRef = doc(db, "adData", advertisementId);
      await updateDoc(adDataRef, {
        ...adData,
        photoUrls,
      });
      console.log("Advertisement updated successfully in adData collection");
      return;
    } catch {
      console.log(
        "Document not found in adData collection, trying advertisements collection"
      );
    }

    // If not found in adData, try advertisements collection
    const adRef = doc(db, "advertisements", advertisementId);
    await updateDoc(adRef, {
      ...adData,
      photoUrls,
    });

    console.log(
      "Advertisement updated successfully in advertisements collection"
    );
  } catch (error: unknown) {
    console.error("Error updating advertisement:", error);
    throw error;
  }
};

/**
 * Resubmit a rejected advertisement with proper status update
 */
export const resubmitRejectedAdvertisement = async (
  advertisementId: string,
  adData: Omit<Advertisement, "createdAt" | "photoUrls" | "id">,
  photos: File[],
  existingPhotoUrls: string[] = [],
  adTag: "free" | "vip" | "vip-prime" = "free"
): Promise<void> => {
  try {
    console.log("Starting rejected advertisement resubmission...", {
      advertisementId,
      adData,
      adTag,
    });

    // Handle photo uploads - only upload new photos (File objects)
    const photoUrls: string[] = [...existingPhotoUrls];

    for (const photo of photos) {
      console.log("Uploading new photo to Cloudinary:", photo.name);
      const url = await uploadToCloudinary(photo);
      console.log("Photo uploaded successfully:", url);
      photoUrls.push(url);
    }

    console.log("Photos processed successfully");

    // Determine the new status based on ad type
    let newStatus: string;
    let approved: boolean;

    if (adTag === "free") {
      // Free ads go directly to approved/published status
      newStatus = "approved";
      approved = true;
    } else {
      // VIP and VIP Prime ads need admin review
      newStatus = "pending";
      approved = false;
    }

    // Update the advertisement with new status
    const adDataRef = doc(db, "adData", advertisementId);
    await updateDoc(adDataRef, {
      ...adData,
      photoUrls,
      status: newStatus,
      approved,
      updatedAt: new Date(),
      // Keep the original publishing data
      tag: adTag,
    });

    console.log(
      `Advertisement resubmitted successfully with status: ${newStatus}`
    );
  } catch (error: unknown) {
    console.error("Error resubmitting advertisement:", error);
    throw error;
  }
};

export const getUserAdvertisements = async (
  userId: string
): Promise<{ drafts: Advertisement[]; published: Advertisement[] }> => {
  try {
    // Get draft ads from advertisements collection
    const draftsQuery = query(
      collection(db, "advertisements"),
      where("userId", "==", userId)
    );

    // Get published ads from adData collection
    const publishedQuery = query(
      collection(db, "adData"),
      where("userId", "==", userId)
    );

    const [draftsSnapshot, publishedSnapshot] = await Promise.all([
      getDocs(draftsQuery),
      getDocs(publishedQuery),
    ]);

    const drafts = draftsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt.toDate(),
      // Add default values for draft ads
      tag: "free" as const,
      planDuration: 30,
      planUnit: "Day" as const,
      approved: false,
      status: "draft" as const,
    })) as Advertisement[];

    const published = publishedSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt.toDate(),
    })) as Advertisement[];

    return { drafts, published };
  } catch (error) {
    console.error("Error fetching user advertisements:", error);
    throw error;
  }
};

export const getAllAdvertisements = async (): Promise<Advertisement[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "adData"));
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt.toDate(),
    })) as Advertisement[];
  } catch (error) {
    console.error("Error fetching all advertisements:", error);
    throw error;
  }
};

export const getAdvertisementsByCity = async (
  city: string
): Promise<Advertisement[]> => {
  try {
    const q = query(
      collection(db, "adData"),
      where("city", "==", city),
      where("approved", "==", true)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt.toDate(),
    })) as Advertisement[];
  } catch (error) {
    console.error("Error fetching advertisements by city:", error);
    throw error;
  }
};

export const getAdvertisementsByPlan = async (
  tag: "free" | "vip" | "vip-prime"
): Promise<Advertisement[]> => {
  try {
    const q = query(
      collection(db, "adData"),
      where("tag", "==", tag),
      where("approved", "==", true)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      createdAt: doc.data().createdAt.toDate(),
    })) as Advertisement[];
  } catch (error) {
    console.error("Error fetching advertisements by plan:", error);
    throw error;
  }
};

// Get user's ad count and basic info for profile dashboard
export const getUserAdsSummary = async (
  userId: string
): Promise<{
  totalAds: number;
  activeAds: number;
  draftAds: number;
  premiumAds: number;
  freeAds: number;
  recentAds: Advertisement[];
  canPostMore: boolean;
}> => {
  try {
    const { drafts, published } = await getUserAdvertisements(userId);

    const totalAds = drafts.length + published.length;
    const activeAds = published.filter(
      (ad) =>
        (ad.status === "approved" || ad.status === "published") && ad.approved
    ).length;
    const draftAds = drafts.length;
    const premiumAds = published.filter(
      (ad) => ad.tag === "vip" || ad.tag === "vip-prime"
    ).length;
    const freeAds = published.filter((ad) => ad.tag === "free").length;

    // Get recent ads (both drafts and published, sorted by date)
    const allAds = [...drafts, ...published].sort((a, b) => {
      const dateA = a.createdAt || new Date(0);
      const dateB = b.createdAt || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });

    const recentAds = allAds.slice(0, 10); // Show up to 10 most recent
    const canPostMore = totalAds < 10;

    return {
      totalAds,
      activeAds,
      draftAds,
      premiumAds,
      freeAds,
      recentAds,
      canPostMore,
    };
  } catch (error) {
    console.error("Error fetching user ads summary:", error);
    return {
      totalAds: 0,
      activeAds: 0,
      draftAds: 0,
      premiumAds: 0,
      freeAds: 0,
      recentAds: [],
      canPostMore: true,
    };
  }
};

// Get user's order history from published ads
export const getUserOrderHistory = async (
  userId: string
): Promise<Advertisement[]> => {
  try {
    // Query for all published/approved ads by the user (including free ones)
    const q = query(
      collection(db, "adData"),
      where("userId", "==", userId),
      where("approved", "==", true)
      // Include both "published" and "approved" status ads
    );

    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        publishedAt: data.publishedAt ? data.publishedAt.toDate() : new Date(),
      } as Advertisement;
    });

    // Sort by publishedAt date, most recent first
    return orders.sort((a, b) => {
      const dateA = a.publishedAt || a.createdAt || new Date(0);
      const dateB = b.publishedAt || b.createdAt || new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
  } catch (error) {
    console.error("Error fetching user order history:", error);
    throw error;
  }
};
