import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Debug function to check user's ads in the database
 */
export const debugUserAds = async (userId: string, userEmail: string) => {
  console.log("🔍 ==> DEBUGGING USER ADS <==");
  console.log("🔍 User ID:", userId);
  console.log("🔍 User Email:", userEmail);

  try {
    // Check what ads exist for this user ID
    const userAdsQuery = query(
      collection(db, "adData"),
      where("userId", "==", userId)
    );
    const userAdsSnapshot = await getDocs(userAdsQuery);

    console.log(
      "🔍 Found",
      userAdsSnapshot.docs.length,
      "ads for userId:",
      userId
    );

    if (userAdsSnapshot.docs.length === 0) {
      // Maybe the ads are stored with email instead of userId?
      const emailAdsQuery = query(
        collection(db, "adData"),
        where("email", "==", userEmail)
      );
      const emailAdsSnapshot = await getDocs(emailAdsQuery);
      console.log(
        "🔍 Found",
        emailAdsSnapshot.docs.length,
        "ads for email:",
        userEmail
      );

      emailAdsSnapshot.docs.forEach((adDoc, index) => {
        const adData = adDoc.data();
        console.log(`🔍 Ad ${index + 1}:`, {
          id: adDoc.id,
          title: adData.title,
          tag: adData.tag,
          status: adData.status,
          approved: adData.approved,
          userId: adData.userId,
          email: adData.email,
          autoDowngraded: adData.autoDowngraded,
          originalTag: adData.originalTag,
        });
      });
    } else {
      userAdsSnapshot.docs.forEach((adDoc, index) => {
        const adData = adDoc.data();
        console.log(`🔍 Ad ${index + 1}:`, {
          id: adDoc.id,
          title: adData.title,
          tag: adData.tag,
          status: adData.status,
          approved: adData.approved,
          userId: adData.userId,
          email: adData.email,
          autoDowngraded: adData.autoDowngraded,
          originalTag: adData.originalTag,
        });
      });
    }

    // Also check if there are any ads that match the titles we saw in the admin
    const knownTitles = [
      "this is test title checking functionality of admin panel",
      "spreadt taxi service",
      "SpreadUp Taxi Service",
      "title ad number 1",
      "this is the Title AD take 2",
      "this is title take 45",
      "this is real title ad",
      "This is title no 10",
      "30day plan title",
    ];

    for (const title of knownTitles) {
      const titleQuery = query(
        collection(db, "adData"),
        where("title", "==", title)
      );
      const titleSnapshot = await getDocs(titleQuery);

      if (titleSnapshot.docs.length > 0) {
        titleSnapshot.docs.forEach((adDoc) => {
          const adData = adDoc.data();
          console.log(`🔍 Found ad by title "${title}":`, {
            id: adDoc.id,
            userId: adData.userId,
            email: adData.email,
            tag: adData.tag,
            status: adData.status,
            approved: adData.approved,
            autoDowngraded: adData.autoDowngraded,
          });
        });
      }
    }
  } catch (error) {
    console.error("🔍 Error debugging user ads:", error);
  }
};
